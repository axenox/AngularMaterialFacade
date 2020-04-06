import { Component, OnInit, Input, Inject } from '@angular/core';
import { IWidgetInputInterface } from '../interfaces/widgets/input.interface';
import { IWidgetButton } from '../interfaces/widgets/button.interface';
import { PageComponent } from '../page/page.component'
import { Router, ActivatedRoute } from '@angular/router';
import { IActionGoToPage } from '../interfaces/actions/go-to-page.interface';
import { IActionInterface } from '../interfaces/actions/action.interface';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DialogComponent } from '../dialog/dialog.component';
import { IWidgetDataTable } from '../interfaces/widgets/data-table.interface';
import { IWidgetInterface } from '../interfaces/widgets/widget.interface';
import { environment } from 'src/environments/environment';
import { IActionShowDialog } from '../interfaces/actions/show-dialog.interface';

const ACTION_SHOW_WIDGET = 'exface.Core.ShowWidget';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  constructor(private dialog: MatDialog, private http: HttpClient){}


  @Input()
  widget: IWidgetButton;

  @Input()
  resource: PageComponent;

  @Input()
  structure: IWidgetInterface;

  ngOnInit(): void {}

  loadShowDialog(resource: string){
      // Load JSON description of widget
      // When loaded, save it and load data of table
      return this.http
        .get<IWidgetDataTable>(
          environment.url +
            '?action=' +
            ACTION_SHOW_WIDGET +
            '&resource=' +
            resource
        );
  }

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
    /* this.loadShowDialog('angular-test-2')
      .subscribe((widgetData: IWidgetDataTable) => { */
        const dialogConfig = new MatDialogConfig();

        dialogConfig.data = {structure: action.widget, pageSelector: 'angular-test-2'};
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
    
        const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
     /*  }); */

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
