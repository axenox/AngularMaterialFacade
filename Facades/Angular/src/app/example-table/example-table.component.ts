import { Component, OnInit } from '@angular/core';
import { IColumnDef } from '../data-table/data-table.component';

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
  displayedColumns: IColumnDef[] = [
    { columnDef: 'position', header: 'No.',    cell: (element: any) => `${element.position}` },
    { columnDef: 'name',     header: 'Name',   cell: (element: any) => `${element.name}`     },
    { columnDef: 'weight',   header: 'Weight', cell: (element: any) => `${element.weight}`   },
    { columnDef: 'symbol',   header: 'Symbol', cell: (element: any) => `${element.symbol}`   },
  ];

  constructor() { }

  ngOnInit() {
  }

}
