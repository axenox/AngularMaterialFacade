import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IWidgetInterface } from '../../interfaces/widgets/widget.interface';
import { IWidgetValueInterface } from '../../interfaces/widgets/value.interface';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActionsService } from 'src/app/api/actions.service';
import { DataRow, Actions } from 'src/app/api/actions.interface';
import { IWidgetDialog } from 'src/app/interfaces/widgets/dialog.interface';
import { IWidgetContainer } from 'src/app/interfaces/widgets/container.interface';
import { IWidgetEvent, WidgetEventType } from 'src/app/interfaces/events/widget-event.interface';
import { IWidgetInputInterface } from 'src/app/interfaces/widgets/input.interface';
import { IWidgetLoginPrompt } from 'src/app/interfaces/widgets/login-prompt.interface';

export interface IDialogData {
  structure?: IWidgetDialog;
  tabStructure?: IWidgetLoginPrompt;
  pageSelector: string;
  prefillRow?: DataRow;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  
  formGroup: FormGroup;

  tabFormGroups: Map<string, FormGroup> = new Map();

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private _snackBar: MatSnackBar,
    private http: HttpClient, private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData) {}

  ngOnInit() {  
    // create a FormGroup, that will be used for every child of this widget
    if (this.data.structure) {
      this.formGroup=new FormGroup({});
      this.fillInputWidgets(this.formGroup, this.data.structure.widgets);
    } else if (this.data.tabStructure) {
      this.data.tabStructure.widgets.forEach((widget: IWidgetInterface) => {
        const formGroup=new FormGroup({});
        this.fillInputWidgets(formGroup, [widget]);
        this.tabFormGroups.set(widget.id, formGroup);
      });
      
    }
  }

  /**
   * add the needed controls to the form group, for all descendant children of type Input...
   */
  fillInputWidgets(formGroup: FormGroup, widgets: IWidgetInterface[]) {
    widgets.forEach((widget: IWidgetInterface) => {
      if (widget.widget_type.startsWith('Input') || widget.widget_type === 'Display' || widget.widget_type === 'Image') {
        const inputWidget = widget as IWidgetInputInterface;
        const widgetName = inputWidget.attribute_alias;
        const validators: ValidatorFn[] = [];
        if(inputWidget.required) {
          validators.push(Validators.required);
        }
        formGroup.addControl(widgetName, new FormControl(this.data.prefillRow ? this.data.prefillRow[widgetName] : undefined, validators));
      }
      if ((widget as IWidgetLoginPrompt).widgets) {
        this.fillInputWidgets(formGroup, (widget as IWidgetLoginPrompt).widgets);
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

  hasTabs(widget: IWidgetLoginPrompt | IWidgetInterface): boolean {
    if (!widget) {
      return false;
    }

    if (widget.widget_type === 'Tabs') {
      return true;
    }

    if (widget.hasOwnProperty('widgets')) {
      for (let child of (widget as IWidgetLoginPrompt).widgets) {
        if (this.hasTabs(child)) {
          return true;
        }
      }
    }

    return false;
  }
}


