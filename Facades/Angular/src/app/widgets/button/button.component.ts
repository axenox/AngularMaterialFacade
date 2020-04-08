import { Component, OnInit, Input, Inject } from '@angular/core';
import { IWidgetButton } from '../../interfaces/widgets/button.interface';
import { DataResponse } from '../../api/actions.service'
import { IActionGoToPage } from '../../interfaces/actions/go-to-page.interface';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent, IDialogData } from '../dialog/dialog.component';
import { IWidgetInterface } from '../../interfaces/widgets/widget.interface';
import { IActionShowDialog } from '../../interfaces/actions/show-dialog.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { ActionsService } from 'src/app/api/actions.service';
import { zip } from 'rxjs';

const ACTION_SHOW_WIDGET = 'exface.Core.ShowWidget';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  constructor(private dialog: MatDialog, private actions: ActionsService){}


  @Input()
  widget: IWidgetButton;

  @Input()
  pageSelector: string;
 
  @Input()
  selection: SelectionModel<any>;

  @Input()
  structure: IWidgetInterface;

  ngOnInit(): void {}

  onClick(): void {
    switch (true) {
        case this.isActionGoToPage(this.widget.action):
          this.onClickGoToPage(this.widget.action as IActionGoToPage);
          break;
        case this.isActionShowDialog(this.widget.action):
          this.onClickShowDialog(this.widget.action as IActionShowDialog);
          break;
        default:

            alert('click!');
    } 
  }

  onClickGoToPage(action: IActionGoToPage) {
    document.location.href = '/page/' + action.page_alias;
    //this.router.navigateByUrl('/page/' + action.page_alias);
  }

  onClickShowDialog(action: IActionShowDialog) {
    const uid = this.selection.selected.length>0 && this.selection.selected[0].UID;
    if (uid) {
      const showWidget$ = this.actions.showWidget(this.pageSelector, action.widget.id);
      const readPrefill$ = this.actions.readPrefill(action.widget.id, uid);
      zip(showWidget$, readPrefill$, (structure: IWidgetInterface, prefill: DataResponse) => ({structure, prefill}))
        .subscribe(pair => {
          const dialogConfig = new MatDialogConfig();
          const prefillRow = pair.prefill && pair.prefill.rows.length>0 && pair.prefill.rows[0];
          const dialogData: IDialogData = {structure: pair.structure, pageSelector: this.pageSelector, prefillRow};

          dialogConfig.data = dialogData;
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
      
          const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
        });
    }
  }

  isActionGoToPage(object: any): object is IActionGoToPage {
    return 'page_alias' in object;
  }

  isActionShowDialog(object: any): object is IActionShowDialog {
    return 'alias' in object && object.alias === 'exface.Core.ShowObjectEditDialog';
  }
}
