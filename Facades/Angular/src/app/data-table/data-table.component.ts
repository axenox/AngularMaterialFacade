import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { DialogTestComponent } from '../dialog-test/dialog-test.component';
import {MatPaginator} from '@angular/material/paginator';
import { IWidgetDataTable } from '../widgets/interfaces/data-table.interface';
import { IWidgetFilter } from '../widgets/interfaces/filter.interface';
import { IWidgetDataColumn } from '../widgets/interfaces/data-column.interface';


export interface IColumnDef {
  columnDef: string;
  header: string;
  cell: (element: any) => string;
}

export interface FilterChip {
  property: string;
  name: string;
  value: any;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnChanges {

  @Input() 
  rows: any[];

/*
  @Input()
  columns: IColumnDef[];
*/

  @Input()
  config: IWidgetDataTable;

  @Output()
  filterChange= new EventEmitter();

  displayedColumns: string[];

  globalSearch: string;

  dataSource: MatTableDataSource<any>;

  filter={_global_: ''};

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  filterChips: FilterChip[] = [];
  dialogRef: any;

  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter._global_ = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.config.filters); 
  }

  startSearch(){
    this.config.filters.forEach((col:IWidgetFilter)=>{
      const value=this.filter[col.input_widget.data_column_name];
      if (value){
        this.addChip(col.input_widget.data_column_name, col.caption, value);
      }
    });
    //this.dataSource.filter = JSON.stringify(this.filter);
    this.filterChange.emit(this.filterChips);
  }

 addChip(property: string, name: string, value: string): void{
    this.removeChipWithName(name);

    if ((value || '').trim()) {
      this.filterChips.push({property, name , value});
    }
  }

  removeChipWithName(name: string) {
    const chip = this.filterChips.find((chip: FilterChip) => chip.name === name);
    if (chip) {
      this.removeChip(chip);
    }
  }

  removeChip(chip: FilterChip): void {
    const index = this.filterChips.indexOf(chip);

    if (index >= 0) {
      this.filterChips.splice(index, 1);
      delete this.config.filters[chip.property];
      this.dataSource.filter = JSON.stringify(this.config.filters);
    }
  }

  

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.displayedColumns = this.config.columns.map(c => c.data_column_name);
    this.displayedColumns.push('_actions_');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rows) {
      this.createDataSource();
    }
  }

  createDataSource() {
    this.dataSource = new MatTableDataSource(this.rows);
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.tableFilter();
    this.dataSource.paginator = this.paginator;
  }

  tableFilter() {
    return (row: any, filter: string) => {
      const globalValue = this.filter._global_;

      // globale Suche 
      if (globalValue && globalValue.trim().length > 0) {
        let found = false;
        this.config.columns.forEach((col: IWidgetDataColumn) => {
          const rowValue = row[col.data_column_name];
          if (rowValue && rowValue.toLowerCase().indexOf(globalValue) !== -1) {
            found = true;
          }
        });
        if (!found) {
          return false;
        }
      }

      // Spaltenweise filtern
      let match = true;
      this.filterChips.forEach((chip: FilterChip) => {
        const rowValue = row[chip.property];
        if (!rowValue || rowValue.toLowerCase().indexOf(chip.value.toLowerCase()) === -1) {
          match = false;
        }
      });
      return match;
    }
  }

  editRow(row: any) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(DialogTestComponent, dialogConfig);
    dialogRef.componentInstance.data=Object.assign({},row);

    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Dialog output:", data);
        if (data){
          Object.assign(row,data);
        }
      }
    );
    
  }

  alert(){
    alert("pressed");
  }

  removeRow(row: any){
    this.rows = this.rows.filter((aRow: any) => aRow !== row);
    const filter = this.dataSource.filter;
    this.createDataSource();
    this.dataSource.filter = filter;
  }

  addRow() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(DialogTestComponent, dialogConfig);
    dialogRef.componentInstance.data={};

    dialogRef.afterClosed().subscribe(
      data => {
        console.log("Dialog output:", data);
        if (data){
          this.rows.push(data);
          const filter = this.dataSource.filter;
          this.createDataSource();
          this.dataSource.filter = filter;
        }
      }
    ); 
  }  
}
