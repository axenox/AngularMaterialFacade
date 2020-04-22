import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { IWidgetButton } from '../../interfaces/widgets/button.interface';
import { ActionsService } from '../../api/actions.service'
import { DataResponse, DataRow, Request, Actions } from '../../api/actions.interface'
import { IActionGoToPage } from '../../interfaces/actions/go-to-page.interface';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent, IDialogData } from '../dialog/dialog.component';
import { IWidgetInterface } from '../../interfaces/widgets/widget.interface';
import { IActionShowDialog } from '../../interfaces/actions/show-dialog.interface';
import { zip, of } from 'rxjs';
import { IWidgetDialog } from 'src/app/interfaces/widgets/dialog.interface';
import { IWidgetEvent, WidgetEventType } from 'src/app/interfaces/events/widget-event.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Action } from 'rxjs/internal/scheduler/Action';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2'

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
  inputRows: DataRow[];

  @Input()
  formGroup: FormGroup;

  @Input()
  structure: IWidgetInterface;

  @Input()
  iconOnly: boolean;

  @Output()
  widgetEvent = new EventEmitter<IWidgetEvent>();

  ngOnInit(): void {}

  getInput(): DataRow[] {
    return this.inputRows || (this.formGroup && [this.formGroup.value]);
  }

  onClick(): void {
    const input = this.getInput();
    const action = this.widget.action;
    if (!action) {
      const event: IWidgetEvent = {source: this.widget, type: WidgetEventType.CLICKED, value: true};
      this.widgetEvent.emit(event);  
  
      return;
    }

    const selectedRows = input.length;
    if(action.input_rows_min != null || action.input_rows_max != null) {
      if (selectedRows < action.input_rows_min) {
        if (action.input_rows_min === action.input_rows_max) {
          Swal.fire({
            text: `Please select ${action.input_rows_min} row(s)`,
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          return;
        } else {
          Swal.fire({
            text: `Please select at least ${action.input_rows_min} row(s)`,
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          return;
        }
      } 
      if (selectedRows > action.input_rows_max) {
        Swal.fire({
          text: `You can not select more then ${action.input_rows_max} row(s).`,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }
    }
    

    switch (true) {
        case this.isActionGoToPage(action):
          this.onClickGoToPage(action as IActionGoToPage);
          break;
        case this.isActionShowDialog(action):
          this.onClickShowDialog(action as IActionShowDialog);
          break;
        default:
            // check if the form values are valid, if not "touch" the form to show the invalid fields
            if (this.formGroup && !this.formGroup.valid) {
              this.formGroup.markAllAsTouched();
              return;
            }
            const request: Request = {action: action.alias, resource: this.pageSelector, data: {rows: input, object_alias: action.object_alias}}
            this.actions.callAction(request).subscribe(
              (result: DataResponse) => {
                const event: IWidgetEvent = {source: this.widget, type: WidgetEventType.ACTION_CALLED, value: true};
                this.widgetEvent.emit(event);
                this._snackBar.open(result.success, undefined, {
                  duration: 2000,
                  panelClass:['snackbar-success']
                });
              },
              (error: any) => {
                const event: IWidgetEvent = {source: this.widget, type: WidgetEventType.ACTION_CALLED, value: false};
                this.widgetEvent.emit(event);
                this._snackBar.open(error && error.statusText ? error.statusText : 'Unknown error', undefined, {
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
    const showWidget$ = this.actions.showWidget(this.pageSelector, action.widget.id);

    let readPrefill$ = of(undefined);
    if (action.prefill_with_prefill_data || action.prefill_with_input_data || action.prefill_with_filter_context) {
      const request: Request = {
        action: Actions.ACTION_READ_PREFILL, 
        resource: this.pageSelector, 
        data: {object_alias: action.object_alias, rows: action.prefill_with_input_data ? this.getInput() : []},
        element: action.widget.id
      };
      readPrefill$ = this.actions.callAction(request);
    }
    
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
          if (result) {
            const event: IWidgetEvent = {source: this.widget, type: WidgetEventType.DATA_CHANGED, value: result};
            this.widgetEvent.emit(event);
          }
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
