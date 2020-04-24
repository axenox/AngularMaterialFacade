import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActionsService } from 'src/app/api/actions.service';
import { AbstractInputComponent } from '../abstract-input.component';
import { DataResponse, DataRow } from 'src/app/api/actions.interface';
import { IWidgetInputComboTable } from 'src/app/interfaces/widgets/input-combo-table.interface';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';


export interface ISelectValue {
  text: string;
  value: string;
}


@Component({
  selector: 'app-input-combo-table',
  templateUrl: './input-combo-table.component.html',
  styleUrls: ['./input-combo-table.component.css']
})

export class InputComboTableComponent extends AbstractInputComponent implements OnInit {

  @Input()
  widget: IWidgetInputComboTable;

  @Input()
  formGroup: FormGroup;

  filteredOptions: Observable<ISelectValue[]>;

  canBeOpened: boolean = false;

  opened: boolean = false;

  /**
   * value for the text shown to user, it is not the real value saved in the hidden component
   */
  text: string | ISelectValue;

  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) 
  inputAutoComplete: MatAutocompleteTrigger;


  constructor(private actions: ActionsService) { 
    super();
  }

  onInputChange(value: string | ISelectValue) {
    if (value && value.hasOwnProperty('text') && value.hasOwnProperty('value')) {
      const newValue = this.text as ISelectValue;
      this.setControlValue(newValue.value);
      setTimeout(() => {this.text = newValue.text}, 1);
    } else {
      this.filteredOptions = this.loadData(value as string);
    }
  }

  activateOpening() {
    this.canBeOpened = true;
  }

  onClick() {
    if (this.opened) {
      this.inputAutoComplete.closePanel();
      this.canBeOpened=false;
    } else {
      this.activateOpening();
      this.inputAutoComplete.openPanel();
    }
  }
 
  ngOnInit() {
    this.filteredOptions = this.loadData('');
  }

  displayFn() {
    return (selectValue: ISelectValue): string => {
      if (!selectValue) {
        return '';
      }
      
      this.setControlValue(selectValue.value);
      return selectValue && selectValue.text ? selectValue.text : '';
    }
  }

  handleOpen(param: any) {
    if (!this.canBeOpened) {
      this.inputAutoComplete.closePanel();
    } else {
      this.opened = true;
    }
  }

  handleClosed() {
    this.opened = false;
  }

  /*
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.widget.selectable_options.filter(option => option.toLowerCase().includes(filterValue));
  }
  */

  loadData(value: string): Observable<ISelectValue[]> {
    const tableWidget = this.widget.table;
    return this.actions.readData(this.pageSelector, tableWidget, null, null, 0, 999, value.trim())
      .pipe(map((response: DataResponse) => {
        if (!response.rows || response.rows.length === 0) {
          this.setControlValue(null);
        }
        return response.rows.map((row: DataRow) => {
          const text = row[this.widget.text_attribute_alias];
          const value = row[this.widget.value_attribute_alias];
          if (this.text == null && this.getControl().value && value === this.getControl().value) {
            this.text = text;
          }
          return { text, value };
        })
      }));
  }

  setControlValue(value: any) {
    this.getControl().setValue(value);
    this.getControl().markAsTouched();
  }
}
