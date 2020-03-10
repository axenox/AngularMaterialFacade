import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IWidgetDataTable } from '../interfaces/widgets/data-table.interface';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IWidgetInterface } from '../interfaces/widgets/widget.inteface';

const ACTION_SHOW_WIDGET = 'exface.Core.ShowWidget';

// tslint:disable-next-line:no-empty-interface
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

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {
  structure: IWidgetInterface;

  resource: string;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.resource = params.get('pageSelector');

      // Load JSON description of widget
      // When loaded, save it and load data of table
      this.http
        .get<IWidgetDataTable>(
          environment.url +
            '?action=' +
            ACTION_SHOW_WIDGET +
            '&resource=' +
            this.resource
        )
        .subscribe((data: IWidgetDataTable) => {
          this.structure = data;
        });
    });
  }
}
