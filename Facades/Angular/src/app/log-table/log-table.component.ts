import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IColumnDef, FilterChip } from '../data-table/data-table.component';
import datatableJson from '../../assets/json/datatable.json';
import { IWidgetDataTable } from '../data-table/data-table-structure.interface';


export interface LogEntry {
  UID: string;
  TYPE: string;
  APP__ALIAS: string;
  CODE: string;
  TITLE: string;
  MODIFIED_ON: string;
  CREATED_ON: string;
}

export interface LogEntryResponse {
  rows: LogEntry[];
  recordsFiltered?: number;
  recordsTotal?: number;
  recordsLimit?: number;
  recordsOffset?: number;
  footerRows?: number;
  success?: string;
}

const URL_DATA=     'http://localhost/exface/exface/api/angular';
const URL_STRUCTURE='http://localhost/exface/exface/api/angular?action=exface.Core.ShowWidget&resource=angular-test';
@Component({
  selector: 'app-log-table',
  templateUrl: './log-table.component.html',
  styleUrls: ['./log-table.component.css']
})
export class LogTableComponent implements OnInit {
  response: LogEntryResponse = {rows: []};

  structure: IWidgetDataTable;

  rows: LogEntry[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
   
    
    this.http.get<IWidgetDataTable>(URL_STRUCTURE).subscribe(
      (data: IWidgetDataTable) => {
        console.log(data);
        this.structure = data;
      }
    );
    
   // this.structure$ = this.http.get<IWidgetDataTable>(URL_STRUCTURE);

    //this.structure = datatableJson;
    this.loadData();
  }

  loadData(chips?: FilterChip[]){
    const params = {
      action: 'exface.Core.ReadData',
      resource: 'angular-test',
      element: 'DataTable',
      object: '0x11e6c3859abc5faea3e40205857feb80',
      q: '',
      'data[oId]': '0x11e6c3859abc5faea3e40205857feb80',
      sort: 'CREATED_ON',
      order: 'desc',
      start: '0',
/*      'data[filters][conditions][0][expression]': 'CODE',
      'data[filters][conditions][0][comparator]':'',
      'data[filters][conditions][0][value]':'',
      'data[filters][conditions][0][object_alias]':'exface.Core.MESSAGE',
*/      
      length: '50',
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
    this.http.get<LogEntryResponse>(URL_DATA,{params}).subscribe(
      (response: LogEntryResponse) => {
        this.response = response;
      }
    );
  }

  onFilterChange(chips:FilterChip[]){
    this.loadData(chips);    
  }

}
