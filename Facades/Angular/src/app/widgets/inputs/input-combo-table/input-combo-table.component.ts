import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActionsService } from 'src/app/api/actions.service';
import { AbstractInputComponent } from '../abstract-input.component';
import { DataResponse, DataRow } from 'src/app/api/actions.interface';
import { IWidgetInputComboTable } from 'src/app/interfaces/widgets/input-combo-table.interface';


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

  /**
   * value for the text shown to user, it is not the real value saved in the hidden component
   */
  text: string;

  constructor(private actions: ActionsService) { 
    super();
  }

  onInputChange(value: any) {
    if (value && value.hasOwnProperty('text') && value.hasOwnProperty('value')) {
      this.text = value.text;
      this.getControl().setValue(value.value);
    } else {
      this.filteredOptions = this.loadData(value);
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
      
      this.getControl().setValue(selectValue.value);
      return selectValue && selectValue.text ? selectValue.text : '';
    }
  }

  /*
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.widget.selectable_options.filter(option => option.toLowerCase().includes(filterValue));
  }
  */

  loadData(value: string): Observable<ISelectValue[]> {
    const tableWidget = this.widget.table;
    return this.actions.readData(this.pageSelector, tableWidget, null, null, 0, 999, value)
      .pipe(map((response: DataResponse) => {
        return response.rows.map((row: DataRow) => {
          const text = row[this.widget.text_attribute_alias];
          const value = row[this.widget.value_attribute_alias];
          if (!this.text && this.getControl().value && value === this.getControl().value) {
            this.text = text;
          }
          return { text, value };
        })
      }));
  }
}
