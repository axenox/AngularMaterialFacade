import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IColumnDef } from '../data-table/data-table.component';

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

const URL='http://sdrexf2.salt-solutions.de/spielwiese/exface//api/ui5?action=exface.Core.ReadData&resource=exface.core.messages&element=DataTable&object=0x11e6c3859abc5faea3e40205857feb80&q=&data%5BoId%5D=0x11e6c3859abc5faea3e40205857feb80&data%5Bfilters%5D%5Boperator%5D=AND&data%5Bfilters%5D%5Bconditions%5D%5B0%5D%5Bexpression%5D=CODE&data%5Bfilters%5D%5Bconditions%5D%5B0%5D%5Bcomparator%5D=&data%5Bfilters%5D%5Bconditions%5D%5B0%5D%5Bvalue%5D=&data%5Bfilters%5D%5Bconditions%5D%5B0%5D%5Bobject_alias%5D=exface.Core.MESSAGE&data%5Bfilters%5D%5Bconditions%5D%5B1%5D%5Bexpression%5D=TITLE&data%5Bfilters%5D%5Bconditions%5D%5B1%5D%5Bcomparator%5D=&data%5Bfilters%5D%5Bconditions%5D%5B1%5D%5Bvalue%5D=&data%5Bfilters%5D%5Bconditions%5D%5B1%5D%5Bobject_alias%5D=exface.Core.MESSAGE&data%5Bfilters%5D%5Bconditions%5D%5B2%5D%5Bexpression%5D=APP&data%5Bfilters%5D%5Bconditions%5D%5B2%5D%5Bcomparator%5D=%3D%3D&data%5Bfilters%5D%5Bconditions%5D%5B2%5D%5Bvalue%5D=&data%5Bfilters%5D%5Bconditions%5D%5B2%5D%5Bobject_alias%5D=exface.Core.MESSAGE&sort=CREATED_ON&order=desc&start=0&length=30';

@Component({
  selector: 'app-log-table',
  templateUrl: './log-table.component.html',
  styleUrls: ['./log-table.component.css']
})
export class LogTableComponent implements OnInit {
  response: LogEntryResponse = {rows: []};
  rows: LogEntry[];
  columns: IColumnDef[] = [
    { columnDef: 'TYPE', header: 'Type',    cell: (element: any) => `${element.TYPE}` },
    { columnDef: 'APP__ALIAS',     header: 'App Alias',   cell: (element: any) => `${element.APP__ALIAS}` },
    { columnDef: 'CODE', header: 'Message Code',    cell: (element: any) => `${element.CODE}` },
    { columnDef: 'TITLE',   header: 'Title', cell: (element: any) => `${element.TITLE}` },
  ];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<LogEntryResponse>(URL).subscribe(
      (response: LogEntryResponse) => {
        this.response = response;
      }
    );
  }

}
