import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IWidgetDataTable } from '../../interfaces/widgets/data-table.interface';
import { FilterEntry } from '../../widgets/data-table/data-table.component';
import { Observable } from 'rxjs';
import { SortDirection } from '@angular/material/sort';
import { IWidgetInterface } from '../../interfaces/widgets/widget.interface';
import { DataResponse, Request } from '../actions.interface';
import { HttpActionsService } from './http-actions.service';
import { IShell } from 'src/app/interfaces/shell-interface';
import { map } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { IWidgetLoginPrompt } from 'src/app/interfaces/widgets/login-prompt.interface';

@Injectable({
  providedIn: 'root'
})

export class HttpWithLocalWriteActionsService extends HttpActionsService {

constructor(http: HttpClient, translate: TranslateService) {
  super(http, translate);
 }

  /**
   * Load JSON description of widget
   * @param pageSelector the UI-Page to show
   * @param element the id of the widget to show
   */
  public showWidget(pageSelector: string, element?: string): Observable<IWidgetInterface>{
    return super.showWidget(pageSelector, element).pipe(
      map((response: IWidgetInterface) => {
        this.saveToFileSystem(response, pageSelector, element);
        return response;
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
      return super.readData(pageSelector, widget, sort, order, start, length, q, filterEntries);
  }

  /**
   * generic calling of a server action
   * @param request the needed data to fullfill the request.
   */
  public callAction(request: Request): Observable<DataResponse> {
    return super.callAction(request);
  }

  /**
   * Gets the shell structure of the application.
   */
  public callShellAction(): Observable<IShell | IWidgetLoginPrompt> {
    return super.callShellAction();
  }
  
  private saveToFileSystem(response: any, pageSelector: string, element?: string) {
    const filename = pageSelector + (element ? "___" + element : '') + '.json';
    const blob = new Blob([JSON.stringify(response)], { type: 'text/plain' });
    saveAs(blob, filename);
  }
}

