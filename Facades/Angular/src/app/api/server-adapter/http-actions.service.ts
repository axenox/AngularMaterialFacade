import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { IWidgetDataTable } from '../../interfaces/widgets/data-table.interface';
import { FilterEntry } from '../../widgets/data-table/data-table.component';
import { environment } from 'src/environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { SortDirection } from '@angular/material/sort';
import { IWidgetInterface } from '../../interfaces/widgets/widget.interface';
import { ActionsService } from '../actions.service';
import { Actions, DataResponse, Request } from '../actions.interface';
import { IShell } from 'src/app/interfaces/shell-interface';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { IServerError } from 'src/app/interfaces/server-error.interface';
import { TranslateService } from '@ngx-translate/core';
import { IWidgetLoginPrompt } from 'src/app/interfaces/widgets/login-prompt.interface';
import { RequestOptions } from 'https';


@Injectable({
  providedIn: 'root'
})

export class HttpActionsService extends ActionsService {

constructor(http: HttpClient, translate: TranslateService) {
  super(http, translate);
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
    
    return this.http.get<IWidgetInterface>(environment.url, { params, withCredentials: true})
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.showError(err);
          return throwError(err);
        }));
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

      if (q != null) {
        params.q = q;
      }

      if (sort) {
        params.sort = sort;
        params.order = order;
      }
    
      if (filterEntries && filterEntries.length > 0) {
        params['data[object_alias]'] = widget.object_alias;
        params['data[filters][operator]'] = 'AND';
  
        filterEntries.forEach((chip: FilterEntry, index: number) => {
          params['data[filters][conditions][' + index + '][expression]'] =
            chip.property;
          params['data[filters][conditions][' + index + '][value]'] = chip.value;
          params['data[filters][conditions][' + index + '][comparator]'] = '==';
          params['data[filters][conditions][' + index + '][object_alias]'] = widget.object_alias;
        });
      }

    return this.http.get<DataResponse>(environment.url, { params, withCredentials: true })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.showError(err);
          return throwError(err);
        }));
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
          const value= data[key] != null ? data[key] : '';
          params[`data[rows][${index}][${key}]`] = value;
        });  
      });  
    }

    return this.http.get<DataResponse>(environment.url, { params, withCredentials: true})
    .pipe(
      catchError((err: HttpErrorResponse) => {
        this.showError(err);
        return throwError(err);
      }));;
  }

    /**
   * Gets the shell structure of the application.
   */
  public callShellAction(): Observable<IShell | IWidgetLoginPrompt> {
    return this.http.get<IShell>(environment.url, { params: {action: environment.shellAction}, withCredentials: true})
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.showError(err);
          if ('error' in err) {
            return of(err.error);
          }
          return throwError(err);
        }));
  }

  showError(response: HttpErrorResponse) {
    if (response.status === 401) { //unauthorized errors will be handled with not showing data
      return;
    }

    let oError = null;
    if (response.error != null) {
        if (response.error.error != null) {
          oError = response.error.error;
        }
    }
    console.log(oError);
    switch (true) {
      case oError && oError.code != null:
        Swal.fire({
          title: oError.title,
          text: oError.message,
          footer: `${this.translate.instant('ERROR.LOGID')}: ${oError.logid}`,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        break;
      case oError && oError.message != null:
        Swal.fire({
          title: 'Error',
          text: oError.message,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        break;
      case response && response.statusText != null:
        Swal.fire({
          title: 'Error ' + response.statusText,
          text: response.statusText,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        break;
      default:
        Swal.fire({
          title: 'Unknown Error',
          confirmButtonText: 'OK'
        });
    }
    
  }
}

