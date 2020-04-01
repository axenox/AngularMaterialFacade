import { Component, OnInit, Input, Inject } from '@angular/core';
import { DataTableComponent } from '../data-table/data-table.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarTestComponent } from '../snackbar-test/snackbar-test.component';
import { IActionGoToPage } from '../interfaces/actions/go-to-page.interface';
import { IWidgetDataTable } from '../interfaces/widgets/data-table.interface';
import { IWidgetInterface } from '../interfaces/widgets/widget.interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

const ACTION_SHOW_WIDGET = 'exface.Core.ShowWidget';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  
  @Input()
    structure: IWidgetInterface;
    pageSelector:string;

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private _snackBar: MatSnackBar,
    private http: HttpClient, private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: string){}

    resource: string;


  ngOnInit() {
      // Load JSON description of widget
      // When loaded, save it and load data of table
      this.http
        .get<IWidgetDataTable>(
          environment.url +
            '?action=' +
            ACTION_SHOW_WIDGET +
            '&resource=' +
            this.data
        )
        .subscribe((data: IWidgetDataTable) => {
          this.structure = data;
        });
  
  }

  saved() {
    this._snackBar.openFromComponent(SnackbarTestComponent, {
      duration: 2000,
      panelClass:['snackbarsettings']
    });
  
  }
  
  close() {
    this.dialogRef.close();
  }
}


