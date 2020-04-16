import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { IWidgetDataTable } from '../interfaces/widgets/data-table.interface';
import { FilterEntry } from '../widgets/data-table/data-table.component';
import { Observable } from 'rxjs';
import { SortDirection } from '@angular/material/sort';
import { IWidgetInterface } from '../interfaces/widgets/widget.interface';
import { DataResponse, Request } from './actions.interface';

@Injectable({
  providedIn: 'root'
})
export abstract class ActionsService {

  constructor(public http: HttpClient) { }

  /**
   * Load JSON description of widget
   * @param pageSelector the UI-Page to show
   * @param element the id of the widget to show
   */
  public abstract showWidget(pageSelector: string, element?: string): Observable<IWidgetInterface>


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
  public abstract readData(pageSelector: string, widget: IWidgetDataTable, sort: string, order: SortDirection, 
    start: number, length: number, q: string, filterEntries?: FilterEntry[]): Observable<DataResponse>
    

  /**
   * generic calling of a server action
   * @param request the needed data to fullfill the request.
   */
  public abstract callAction(request: Request): Observable<DataResponse>
}

