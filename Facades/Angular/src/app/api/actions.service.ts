import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { IWidgetDataTable } from '../interfaces/widgets/data-table.interface';
import { FilterEntry } from '../widgets/data-table/data-table.component';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { SortDirection } from '@angular/material/sort';
import { IWidgetInterface } from '../interfaces/widgets/widget.interface';

export enum Actions {
  ACTION_SHOW_WIDGET = 'exface.Core.ShowWidget',
  ACTION_READ_PREFILL = 'exface.Core.ReadPrefill',
  ACTION_UPDATE_DATA = 'exface.Core.UpdateData',
  ACTION_SHOW_OBJECT_EDIT_DIALOG = 'exface.Core.ShowObjectEditDialog'
}

export interface DataRow {}

export interface DataSheet {
  /**
   * the alias of the meta object.
   */
  object_alias: string;

  /**
   * the data that will be passed to the server action.
   */
  rows: DataRow[];
}

export interface DataResponse {
  rows: DataRow[];
  recordsFiltered?: number;
  recordsTotal?: number;
  recordsLimit?: number;
  recordsOffset?: number;
  footerRows?: number;
  success?: string;
}

export interface Request {
  /**
   * the alias of the action to call.
   */
  action: string;

  /**
   * current page alias.
   */
  resource: string;

  /**
   * the data that will be passed to the server action.
   */
  data?: DataSheet;

  /**
   * the prefill data that will be passed to the server action.
   */
  prefill?: DataSheet;

  /**
   * the alias of the meta object.
   */
  object_alias?: string;
  
  /**
   * ID of the widget.
   */
  element?: string;
}

@Injectable({
  providedIn: 'root'
})

export class ActionsService {

  constructor(private http: HttpClient) { }

  /**
   * Load JSON description of widget
   * @param pageSelector the UI-Page to show
   * @param element the id of the widget to show
   */
  public showWidget(pageSelector: string, element?: string): Observable<IWidgetInterface>{
    const params: {[param: string]: string} = { 
      action: Actions.ACTION_SHOW_WIDGET,
      resource: pageSelector 
    };

    if (element) {
      params.element = element;
    }
    
    return this.http
        .get<IWidgetInterface>(environment.url, { params });
  }

  /**
   * Loading data for DataTable
   * @param pageSelector 
   * @param widget the corresponding widget
   * @param sort the column used for sorting
   * @param order 'asc' or 'desc' for ascending or descending sorting
   * @param start the first row number to show
   * @param length the number of rows to load
   * @param q quick-search entry
   */

  public readData(pageSelector: string, widget: IWidgetDataTable, sort: string, order: SortDirection, 
    start: number, length: number, q: string, filterEntries?: FilterEntry[]): Observable<DataResponse> {
      const params: {[param: string]: string} = {
        action: widget.lazy_loading_action.alias,
        resource: pageSelector,
        element: widget.id,
        object: widget.object_alias,
        start: start.toString(),
        length: length.toString()
      };

      if (q) {
        params.q = q;
      }

      if (sort) {
        params.sort = sort;
        params.order = order;
      }
    
      if (filterEntries && filterEntries.length > 0) {
        params['data[object_alias]'] = 'exface.Core.MESSAGE'
        params['data[filters][operator]'] = 'AND';
  
        filterEntries.forEach((chip: FilterEntry, index: number) => {
          params['data[filters][conditions][' + index + '][expression]'] =
            chip.property;
          params['data[filters][conditions][' + index + '][value]'] = chip.value;
          params['data[filters][conditions][' + index + '][comparator]'] = '==';
          params['data[filters][conditions][' + index + '][object_alias]'] =
            'exface.Core.MESSAGE';
        });
      }

      return this.http.get<DataResponse>(environment.url, { params });
  }

  /**
   * generic calling of a server action
   * @param request the needed data to fullfill the request.
   */
  public callAction(request: Request){
    const params: {[param: string]: string} = {
      action: request.action,
      resource: request.resource,
    }

    if (request.resource) {
      params.resource = request.resource;
    }

    if (request.element) {
      params.element = request.element;
    }

    if (request.data) {
      params['data[object_alias]'] = request.data.object_alias;
      request.data.rows.forEach((data: {[key: string]: string}, index: number) => {
        Object.keys(data).forEach((key: string) => {
          params[`data[rows][${index}][${key}]`] = data[key];
        });  
      });  
    }


    return this.http.get<DataResponse>(environment.url, { params });
  }
}

