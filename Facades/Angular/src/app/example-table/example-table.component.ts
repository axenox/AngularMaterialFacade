import { Component, OnInit } from '@angular/core';
import { IColumnDef } from '../data-table/data-table.component';
import { IWidgetDataTable } from '../data-table/data-table-structure.interface';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-example-table',
  templateUrl: './example-table.component.html',
  styleUrls: ['./example-table.component.css']
})
export class ExampleTableComponent implements OnInit {
  rows = ELEMENT_DATA;

  config:IWidgetDataTable = {
    widget_type: "DataTable",
    data_column_name: "exface.Core.MESSAGE",
    filters: [
      {
        data_column_name: "position",
        caption: "No."
      },
      {
        data_column_name: "name",
        caption: "Name"
      },
      {
        data_column_name: "weight",
        caption: "Weight"
      },
    ],
    columns: [
      {
        data_column_name: "position",
        caption: "No."
      },
      {
        data_column_name: "name",
        caption: "Name"
      },
      {
        data_column_name: "weight",
        caption: "Weight"
      },
      {
        data_column_name: "symbol",
        caption: "Symbol"
      },
    ],
    sorters: [
      {
        data_column_name: "CREATED_ON",
        direction: "desc"
      }
    ]
  }
  

  constructor() { }

  ngOnInit() {
  }

}
