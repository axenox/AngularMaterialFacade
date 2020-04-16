import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IWidgetInterface } from '../../interfaces/widgets/widget.interface';
import { IWidgetValueInterface } from '../../interfaces/widgets/value.interface';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ActionsService } from 'src/app/api/actions.service';
import { DataRow, Actions } from 'src/app/api/actions.interface';
import { IWidgetDialog } from 'src/app/interfaces/widgets/dialog.interface';
import { IWidgetContainer } from 'src/app/interfaces/widgets/container.interface';
import { IWidgetEvent, WidgetEventType } from 'src/app/interfaces/events/widget-event.interface';

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
    const inputWidgets = [];
    this.fillInputWidgets(this.data.structure.widgets, inputWidgets);
    inputWidgets.forEach((widgetName: string) => {
      this.formGroup.addControl(widgetName, new FormControl(this.data.prefillRow ? this.data.prefillRow[widgetName] : undefined));
    })
  }

  /**
   * fill the array names with names of (children)-widgets, that are of type Input...
   */
  fillInputWidgets(widgets: IWidgetInterface[], names: string[]) {
    widgets.forEach((widget: IWidgetInterface) => {
      if (widget.widget_type.startsWith('Input')) {
        names.push((widget as IWidgetValueInterface).attribute_alias);
      }
      if ((widget as IWidgetContainer).widgets) {
        this.fillInputWidgets((widget as IWidgetContainer).widgets, names);
      }
    })
  }

  onWidgetEvent(event: IWidgetEvent) {
    if(event.type === WidgetEventType.ACTION_CALLED){
      this.dialogRef.close({data: {result: event.value}});
    } 
    
    if(event.type === WidgetEventType.CLICKED){
      this.dialogRef.close();
    }
  }
}


