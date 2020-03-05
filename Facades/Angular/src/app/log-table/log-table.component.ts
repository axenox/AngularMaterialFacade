import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IColumnDef, FilterChip } from '../data-table/data-table.component';
import datatableJson from '../../assets/json/datatable.json';
import { IWidgetDataTable } from '../widgets/interfaces/data-table.interface';



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

const ACTION_SHOW_WIDGET = 'exface.Core.ShowWidget';
const URL_FACADE    = 'http://localhost/exface/exface/api/angular';
const URL_RESOURCE  = 'angular-test';

@Component({
  selector: 'app-log-table',
  templateUrl: './log-table.component.html',
  styleUrls: ['./log-table.component.css']
})
export class LogTableComponent implements OnInit {
  response: DataResponse = {rows: []};

  structure: IWidgetDataTable;

  rows: DataRow[];

  constructor(private http: HttpClient) { }

  ngOnInit() {
   
    // Load JSON description of widget
    // When loaded, save it and load data of table
    this.http.get<IWidgetDataTable>(URL_FACADE + '?action=' + ACTION_SHOW_WIDGET + '&resource=' + URL_RESOURCE).subscribe(
      (data: IWidgetDataTable) => {
        this.structure = data;
        this.loadData();
      }
    );

  }

  loadData(chips?: FilterChip[]){
    const params = {
      action: this.structure.lazy_loading_action.alias,
      resource: URL_RESOURCE,
      element: this.structure.id,
      object: this.structure.object_alias,
      q: '',
      'data[oId]': this.structure.lazy_loading_action.object_alias,
      sort: 'CREATED_ON',
      order: 'desc',
      start: '0',      
      length: '150',
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
      }
    );
  }

  onFilterChange(chips:FilterChip[]){
    this.loadData(chips);    
  }

}