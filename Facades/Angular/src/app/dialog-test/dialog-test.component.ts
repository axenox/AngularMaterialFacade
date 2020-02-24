import { Component, OnInit, Input } from '@angular/core';
import { DataTableComponent } from '../data-table/data-table.component';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { SnackbarTestComponent } from '../snackbar-test/snackbar-test.component';


@Component({
  selector: 'app-dialog-test',
  templateUrl: './dialog-test.component.html',
  styleUrls: ['./dialog-test.component.css']
})
export class DialogTestComponent implements OnInit {

  @Input()
    data:any;

  constructor(
    private dialogRef: MatDialogRef<DialogTestComponent>,
    private _snackBar: MatSnackBar){}

  ngOnInit() {
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


