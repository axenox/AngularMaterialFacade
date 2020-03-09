import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DialogTestComponent } from '../dialog-test/dialog-test.component';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { IWidgetDataTable } from '../widgets/interfaces/data-table.interface';
import { IWidgetFilter } from '../widgets/interfaces/filter.interface';
import { IWidgetDataColumn } from '../widgets/interfaces/data-column.interface';
import { HttpClient } from '@angular/common/http';

const URL_FACADE    = 'http://localhost/exface/exface/api/angular';

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

export interface DataRow {}

export interface DataResponse {
  rows: DataRow[];
  recordsFiltered?: number;
  recordsTotal?: number;
  recordsLimit?: number;
  recordsOffset?: number;
  footerRows?: number;
  success?: string;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})

export class DataTableComponent implements OnInit {

  @Input()
  config: IWidgetDataTable;

  @Input()
  pageSelector: string;

  @Output()
  refresh= new EventEmitter();

  displayedColumns: string[];

  globalSearch: string;

  dataSource: MatTableDataSource<any>;

  filter={_global_: ''};

  pager: PageEvent = {
    length: null,
    pageIndex: 0,
    pageSize: 30,
    previousPageIndex: null
  };

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  filterChips: FilterChip[] = [];
  dialogRef: any;

  response: DataResponse = {rows: []};

  rows: DataRow[];

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private dialog: MatDialog, private http: HttpClient) { }

  ngOnInit() {
    this.displayedColumns = this.config.columns.map(c => c.data_column_name);
    this.displayedColumns.push('_actions_');
    this.loadData();
  }

  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter._global_ = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.config.filters); 
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

  globalFilterChange(filter: string){
    this.createDataSource();
    this.dataSource.filter = filter;
  }

  loadData(chips?: FilterChip[]){
    let params = {
      action: this.config.lazy_loading_action.alias,
      resource: this.pageSelector,
      element: this.config.id,
      object: this.config.object_alias,
      q: '',
      'data[oId]': this.config.lazy_loading_action.object_alias,
      sort: 'CREATED_ON',
      order: 'desc',
      start: (this.pager.pageIndex * this.pager.pageSize).toString(),      
      length: this.pager.pageSize.toString(),
    };

    if (chips && chips.length > 0) {
      params['data[filters][operator]'] = 'AND';

      chips.forEach((chip: FilterChip, index: number) => {
        params['data[filters][conditions][' + index + '][expression]'] = chip.property;
        params['data[filters][conditions][' + index + '][value]'] = chip.value;
        params['data[filters][conditions][' + index + '][comperator]'] = '==';
        params['data[filters][conditions][' + index + '][object_alias]'] = 'exface.Core.MESSAGE';
      });
    }
    this.http.get<DataResponse>(URL_FACADE,{params}).subscribe(
      (response: DataResponse) => {
        this.response = response;
        this.rows = response.rows;
        this.createDataSource();
      }
    );
  }

  onPaginate(pageEvent: PageEvent){
      this.pager = pageEvent;
      this.onRefresh();
  }

  onRefresh(){
    this.config.filters.forEach((col:IWidgetFilter)=>{
      const value=this.filter[col.input_widget.data_column_name];
      if (value){
        this.addChip(col.input_widget.data_column_name, col.caption, value);
      }
    });
    this.loadData(this.filterChips);    
  }
}

