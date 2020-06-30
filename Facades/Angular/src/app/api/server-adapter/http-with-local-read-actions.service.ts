import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IWidgetDataTable } from '../../interfaces/widgets/data-table.interface';
import { FilterEntry } from '../../widgets/data-table/data-table.component';
import { Observable, of } from 'rxjs';
import { SortDirection } from '@angular/material/sort';
import { IWidgetInterface } from '../../interfaces/widgets/widget.interface';
import { DataResponse, Request } from '../actions.interface';
import { HttpActionsService } from './http-actions.service';
import { IShell } from 'src/app/interfaces/shell-interface';
import { environment } from 'src/environments/environment';

declare function require(path: string);

@Injectable({
  providedIn: 'root'
})

export class HttpWithLocalReadActionsService extends HttpActionsService {

constructor(http: HttpClient) {
  super(http);
 }

  /**
   * Load JSON description of widget
   * @param pageSelector the UI-Page to show
   * @param element the id of the widget to show
   */
  public showWidget(pageSelector: string, element?: string): Observable<IWidgetInterface>{
    let pageSelectorWithoutPrefix = pageSelector;
    if (pageSelectorWithoutPrefix.startsWith(environment.appPagePrefix)) {
      pageSelectorWithoutPrefix = pageSelector.substr(environment.appPagePrefix.length);
    }
    try {
      const data = require(`../../../assets/static/${pageSelectorWithoutPrefix}.json`);
      console.log(`showWidget(${pageSelector}, ${element})`);
      return of(data);
    } catch (exception) {
      console.log('file does not exist');
      return of(null);
    }
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
      console.log(`readData(${pageSelector},${JSON.stringify(widget)},${sort},${order},${start},${length},${q},${JSON.stringify(filterEntries)},)`);
      return super.readData(pageSelector, widget, sort, order, start, length, q, filterEntries);
  }

  /**
   * generic calling of a server action
   * @param request the needed data to fullfill the request.
   */
  public callAction(request: Request): Observable<DataResponse> {
    console.log(`callAction(${JSON.stringify(request)})`);
    return super.callAction(request);
  }

  /**
   * Gets the shell structure of the application.
   */
  public callShellAction(): Observable<IShell> {
    console.log('callShellAction()');
    return super.callShellAction();
  }
  /*
  private saveToFileSystem(response: any, pageSelector: string, element?: string) {
    const filename = '/assets/static/' + pageSelector + "___" + element;
    const blob = new Blob([JSON.stringify(response)], { type: 'text/plain' });
    saveAs(blob, filename);
  }*/
}

