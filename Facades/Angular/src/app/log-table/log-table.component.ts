import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IWidgetDataTable } from '../interfaces/widgets/data-table.interface';
import { ActivatedRoute, ParamMap } from '@angular/router';

const ACTION_SHOW_WIDGET = 'exface.Core.ShowWidget';
const URL_FACADE    = 'http://localhost/exface/exface/api/angular';
//const URL_RESOURCE  = 'angular-test-2';

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

  resource: string;

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
   
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.resource = params.get('pageSelector');
        
    // Load JSON description of widget
    // When loaded, save it and load data of table
    this.http.get<IWidgetDataTable>(URL_FACADE + '?action=' + ACTION_SHOW_WIDGET + '&resource=' + this.resource).subscribe(
      (data: IWidgetDataTable) => {
        this.structure = data;
      }
    );
      }
    )
  }
}