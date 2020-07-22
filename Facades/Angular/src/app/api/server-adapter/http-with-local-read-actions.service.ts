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

  public loadFromFile(pageSelector: string, element?: string): Observable<any>{
    const fileName = `../../../assets/exported/${pageSelector}${element ? '___' + element : ''}.json`;

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

