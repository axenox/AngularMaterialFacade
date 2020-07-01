import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IWidgetDataTable } from '../../interfaces/widgets/data-table.interface';
import { FilterEntry } from '../../widgets/data-table/data-table.component';
import { Observable, of, throwError } from 'rxjs';
import { SortDirection } from '@angular/material/sort';
import { IWidgetInterface } from '../../interfaces/widgets/widget.interface';
import { DataResponse, Request } from '../actions.interface';
import { HttpActionsService } from './http-actions.service';
import { IShell } from 'src/app/interfaces/shell-interface';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map } from 'rxjs/operators';
import { IWidgetLoginPrompt } from 'src/app/interfaces/widgets/login-prompt.interface';

declare function require(path: string);

@Injectable({
  providedIn: 'root'
})

export class HttpWithLocalReadActionsService extends HttpActionsService {

constructor(http: HttpClient, translate: TranslateService) {
  super(http, translate);
 }

  /**
   * Load JSON description of widget
   * @param pageSelector the UI-Page to show
   * @param element the id of the widget to show
   */
  public showWidget(pageSelector: string, element?: string): Observable<IWidgetInterface>{
    return this.loadFromFile(pageSelector, element);
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
      return super.readData(pageSelector, widget, sort, order, start, length, q, filterEntries);
  }

  /**
   * generic calling of a server action
   * @param request the needed data to fullfill the request.
   */
  public callAction(request: Request): Observable<DataResponse>{
    return super.callAction(request);
  }

  /**
   * Gets the shell structure of the application.
   */
  public callShellAction(): Observable<IShell | IWidgetLoginPrompt> {
    return super.callShellAction();
  }

  public loadFromFile(pageSelector: string, element?: string): Observable<any>{
    let pageSelectorWithoutPrefix = pageSelector;
    if (pageSelectorWithoutPrefix.startsWith(environment.appPagePrefix)) {
      pageSelectorWithoutPrefix = pageSelector.substr(environment.appPagePrefix.length);
    }

    const fileName = `../../../assets/static/${pageSelectorWithoutPrefix}${element ? '___' + element : ''}.json`;

    return this.http.get(fileName).pipe(
      map((result: any) => {
        return result;
      }),
      catchError((err: any) => {
        this.showError(err);
        return throwError(err);
      })
    );
  }

}

