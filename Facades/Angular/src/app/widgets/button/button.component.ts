import { Component, OnInit, Input, Inject } from '@angular/core';
import { IWidgetInputInterface } from '../../interfaces/widgets/input.interface';
import { IWidgetButton } from '../../interfaces/widgets/button.interface';
import { PageComponent } from '../../page/page.component'
import { Router, ActivatedRoute } from '@angular/router';
import { IActionGoToPage } from '../../interfaces/actions/go-to-page.interface';
import { IActionInterface } from '../../interfaces/actions/action.interface';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DialogComponent } from '../dialog/dialog.component';
import { IWidgetDataTable } from '../../interfaces/widgets/data-table.interface';
import { IWidgetInterface } from '../../interfaces/widgets/widget.interface';
import { environment } from 'src/environments/environment';
import { IActionShowDialog } from '../../interfaces/actions/show-dialog.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { ActionsService } from 'src/app/api/actions.service';

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
    this.actions.showWidget(this.pageSelector, action.widget.id)
      .subscribe((widgetData: IWidgetInterface) => {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.data = {structure: widgetData, pageSelector: 'angular-test-2'};
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
    
        const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
     });

    /*dialogRef.afterClosed().subscribe(
      data => {
        console.log("Dialog output:", data);
        if (data){
          Object.assign(row,data);
        }
      }
    );*/
  }

  isActionGoToPage(object: any): object is IActionGoToPage {
    return 'page_alias' in object;
  }

  isActionShowDialog(object: any): object is IActionShowDialog {
    return 'alias' in object && object.alias === 'exface.Core.ShowObjectEditDialog';
  }
}
