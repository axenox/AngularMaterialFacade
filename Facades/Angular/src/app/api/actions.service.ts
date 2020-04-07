import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { IWidgetDataTable } from '../interfaces/widgets/data-table.interface';
import { FilterEntry } from '../widgets/data-table/data-table.component'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { DataResponse } from '../page/page.component';
import { SortDirection } from '@angular/material/sort';
import { IWidgetInterface } from '../interfaces/widgets/widget.interface';

enum Actions {
  ACTION_SHOW_WIDGET = 'exface.Core.ShowWidget'
}

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(private http: HttpClient) { }

  private getQuery(action: Actions, params?: {[key: string]: string}): string {
    let query = 
      environment.url +
        '?action=' +
        action;
        
    if (params) {
      Object.keys(params).forEach(key => query += '&' + key + '=' + params[key]);
    }
    return query;
  }

  /**
   * Load JSON description of widget
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
   * @param end the last row number to show
   * @param q quick-search entry
   */
  public readData(pageSelector: string, widget: IWidgetDataTable, sort: string, order: SortDirection, 
    start: number, end: number, q: string, filterEntries?: FilterEntry[]): Observable<DataResponse> {
      const params: {[param: string]: string} = {
        action: widget.lazy_loading_action.alias,
        resource: pageSelector,
        element: widget.id,
        object: widget.object_alias,
        'data[oId]': widget.lazy_loading_action.object_alias,
        q,
        sort,
        order,
        start: start.toString(),
        length: length.toString()
      };
    
      if (filterEntries && filterEntries.length > 0) {
        params['data[filters][operator]'] = 'AND';
  
        filterEntries.forEach((chip: FilterEntry, index: number) => {
          params['data[filters][conditions][' + index + '][expression]'] =
            chip.property;
          params['data[filters][conditions][' + index + '][value]'] = chip.value;
          params['data[filters][conditions][' + index + '][comperator]'] = '==';
          params['data[filters][conditions][' + index + '][object_alias]'] =
            'exface.Core.MESSAGE';
        });
      }

      return this.http.get<DataResponse>(environment.url, { params })


  }
}
