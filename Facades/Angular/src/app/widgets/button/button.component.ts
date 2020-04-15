import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { IWidgetButton } from '../../interfaces/widgets/button.interface';
import { DataResponse, Actions } from '../../api/actions.service'
import { IActionGoToPage } from '../../interfaces/actions/go-to-page.interface';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent, IDialogData } from '../dialog/dialog.component';
import { IWidgetInterface } from '../../interfaces/widgets/widget.interface';
import { IActionShowDialog } from '../../interfaces/actions/show-dialog.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { ActionsService } from 'src/app/api/actions.service';
import { zip, of, EMPTY } from 'rxjs';
import { IWidgetDialog } from 'src/app/interfaces/widgets/dialog.interface';
import { IWidgetEvent, WidgetEventType } from 'src/app/interfaces/events/widget-event.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

const ACTION_SHOW_WIDGET = 'exface.Core.ShowWidget';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  constructor(private dialog: MatDialog, private _snackBar: MatSnackBar, private actions: ActionsService){}


  @Input()
  widget: IWidgetButton;

  @Input()
  pageSelector: string;
 
  @Input()
  selection: SelectionModel<any>;

  @Input()
  structure: IWidgetInterface;

  @Output()
  widgetEvent = new EventEmitter<IWidgetEvent>();

  ngOnInit(): void {}

  onClick(): void {
    const action = this.widget.action;
    const selectedRows = this.selection.selected.length;
    if (selectedRows < action.input_rows_min) {
      if (action.input_rows_min === action.input_rows_max) {
        alert(`Please select ${action.input_rows_min} row(s)`);
        return;
      } else {
        alert(`Please select at least ${action.input_rows_min} row(s)`);
        return;
      }
    }
    if (selectedRows > action.input_rows_max) {
      alert(`You can not select more then ${action.input_rows_max} row(s).`);
      return;
    }

    switch (true) {
        case this.isActionGoToPage(action):
          this.onClickGoToPage(action as IActionGoToPage);
          break;
        case this.isActionShowDialog(action):
          this.onClickShowDialog(action as IActionShowDialog);
          break;
        default:
            this.actions.action(action.alias, this.selection.selected ).subscribe(
              (result) => {
                const event: IWidgetEvent = {source: this.widget, type: WidgetEventType.DATA_CHANGED, value: action.alias};
                this._snackBar.open(result.success, undefined, {
                  duration: 2000,
                  panelClass:['snackbar-success']
                });
              },
              (error) => {
                const event: IWidgetEvent = {source: this.widget, type: WidgetEventType.DATA_CHANGED, value: action.alias};
                this._snackBar.open(error.statusText, undefined, {
                  duration: 2000,
                  panelClass:['snackbar-error']
                });
              },              
            );
    } 
  }

  onClickGoToPage(action: IActionGoToPage) {
    document.location.href = '/page/' + action.page_alias;
    //this.router.navigateByUrl('/page/' + action.page_alias);
  }

  onClickShowDialog(action: IActionShowDialog) {
    let readPrefill$ = of(undefined);
    if (action.alias === Actions.ACTION_SHOW_OBJECT_EDIT_DIALOG) {
      const uid = this.selection.selected.length>0 && this.selection.selected[0].UID;
      readPrefill$ = this.actions.readPrefill(action.widget.id, uid);
    }
    
    const showWidget$ = this.actions.showWidget(this.pageSelector, action.widget.id);
    zip(showWidget$, readPrefill$, (structure: IWidgetDialog, prefill: DataResponse) => ({structure, prefill}))
      .subscribe(pair => {
        const dialogConfig = new MatDialogConfig();
        const prefillRow = pair.prefill && pair.prefill.rows.length>0 && pair.prefill.rows[0];
        const dialogData: IDialogData = {structure: pair.structure, pageSelector: this.pageSelector, prefillRow};

        dialogConfig.data = dialogData;
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
      
        const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          const event: IWidgetEvent = {source: this.widget, type: WidgetEventType.DATA_CHANGED, value: result};
          this.widgetEvent.emit(event);
        });
      });
  }

  isActionGoToPage(object: any): object is IActionGoToPage {
    return 'page_alias' in object;
  }

  isActionShowDialog(object: any): object is IActionShowDialog {
    return 'fallback_actions' in object && object.fallback_actions.indexOf('ShowDialog') !== -1;
  }
}
