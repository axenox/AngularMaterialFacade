import { Component, OnInit, Input } from '@angular/core';
import { IWidgetInputInterface } from '../interfaces/widgets/input.interface';
import { IWidgetButton } from '../interfaces/widgets/button.interface';
import { PageComponent } from '../page/page.component'
import { Router } from '@angular/router';
import { IActionGoToPage } from '../interfaces/actions/go-to-page.interface';
import { IActionInterface } from '../interfaces/actions/action.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

  constructor(private dialog: MatDialog, private http: HttpClient) {}


  @Input()
  widget: IWidgetButton;

  @Input()
  resource: PageComponent;

  ngOnInit(): void {
  }

  onClick(): void {
    switch (true) {
        case this.isActionGoToPage(this.widget.action):
          this.onClickGoToPage(this.widget.action as IActionGoToPage);
          break;
        default:

            alert('click!');
    } 
  }

  onClickGoToPage(action: IActionGoToPage) {
    document.location.href = '/page/' + action.page_alias;
    //this.router.navigateByUrl('/page/' + action.page_alias);
  }

  onClickShowDialog(action: IActionGoToPage) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = 'angular-test-2';

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);

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

  isActionShowDialog(object: any): object is IActionGoToPage {
    return 'page_alias' in object;
  }
}
