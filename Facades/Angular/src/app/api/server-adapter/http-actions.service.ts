import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { IWidgetDataTable } from '../../interfaces/widgets/data-table.interface';
import { FilterEntry } from '../../widgets/data-table/data-table.component';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { SortDirection } from '@angular/material/sort';
import { IWidgetInterface } from '../../interfaces/widgets/widget.interface';
import { ActionsService } from '../actions.service';
import { Actions, DataResponse, Request } from '../actions.interface';


@Injectable({
  providedIn: 'root'
})

export class HttpActionsService extends ActionsService {

constructor(http: HttpClient) {
  super(http);
 }

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
    
    return this.http.get<IWidgetInterface>(environment.url, { params });
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
  public callAction(request: Request): Observable<DataResponse> {
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

