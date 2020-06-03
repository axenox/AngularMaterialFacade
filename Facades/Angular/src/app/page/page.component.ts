import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';
import { IWidgetInterface } from '../interfaces/widgets/widget.interface';
import { ActionsService } from '../api/actions.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {
  structure$: Observable<IWidgetInterface>;

  resource: string;

  constructor(private actions: ActionsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.url.subscribe((urlSegemnts: UrlSegment[]) => {
      this.resource = urlSegemnts[urlSegemnts.length-1].toString();
      if (this.resource.toLowerCase().endsWith('.html')) {
        this.resource = this.resource.slice(0, -5);
      }
      this.structure$ = this.actions.showWidget(this.resource);
    });
  }
}
