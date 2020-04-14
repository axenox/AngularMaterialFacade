import { Component, OnInit, Input, Inject } from '@angular/core';
import { DataTableComponent } from '../data-table/data-table.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarTestComponent } from '../../snackbar-test/snackbar-test.component';
import { IActionGoToPage } from '../../interfaces/actions/go-to-page.interface';
import { IWidgetDataTable } from '../../interfaces/widgets/data-table.interface';
import { IWidgetInterface } from '../../interfaces/widgets/widget.interface';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DataRow, ActionsService, Actions } from 'src/app/api/actions.service';
import { IWidgetDialog } from 'src/app/interfaces/widgets/dialog.interface';
import { IWidgetButton } from 'src/app/interfaces/widgets/button.interface';

export interface IDialogData {
  structure: IWidgetDialog;
  pageSelector: string;
  prefillRow: DataRow;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  
  formGroup: FormGroup;


  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private _snackBar: MatSnackBar,
    private http: HttpClient, private route: ActivatedRoute,
    private actions: ActionsService,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData) {}

  ngOnInit() {  
    // create a FormGroup, that will be used for every child of this widget
    this.formGroup=new FormGroup({});
    if (this.data.prefillRow) {
      Object.keys(this.data.prefillRow).forEach((key: string) => {
        this.formGroup.addControl(key, new FormControl(this.data.prefillRow[key]))
      });
    }
  }

  onClick(button: IWidgetButton) {
    if(button.action && button.action.alias === Actions.ACTION_UPDATE_DATA){
      this.actions.updateData(this.formGroup.value).subscribe((result: any) => {
        this._snackBar.openFromComponent(SnackbarTestComponent, {
          duration: 2000,
          panelClass:['snackbarsettings']
        });
        this.dialogRef.close({data: {result}});
      });
    }else{
      this.dialogRef.close()
    }
  }
} 


