import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IColumnDef, FilterChip } from '../data-table/data-table.component';
import { IWidgetDataTable } from '../widgets/interfaces/data-table.interface';

const ACTION_SHOW_WIDGET = 'exface.Core.ShowWidget';
const URL_FACADE    = 'http://localhost/exface/exface/api/angular';
const URL_RESOURCE  = 'angular-test-2';

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
  selector: 'app-log-table',
  templateUrl: './log-table.component.html',
  styleUrls: ['./log-table.component.css']
})
export class LogTableComponent implements OnInit {

  structure: IWidgetDataTable;

  resource: string = URL_RESOURCE;

  constructor(private http: HttpClient) { }

  ngOnInit() {
   
    // Load JSON description of widget
    // When loaded, save it and load data of table
    this.http.get<IWidgetDataTable>(URL_FACADE + '?action=' + ACTION_SHOW_WIDGET + '&resource=' + this.resource).subscribe(
      (data: IWidgetDataTable) => {
        this.structure = data;
      }
    );
  }
}