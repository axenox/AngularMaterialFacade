import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, UrlSegment } from '@angular/router';
import { IWidgetInterface } from '../interfaces/widgets/widget.interface';
import { ActionsService } from '../api/actions.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {
  structure$: Observable<IWidgetInterface>;

  resource: string;

  constructor(private actions: ActionsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.url.subscribe((urlSegments: UrlSegment[]) => {
      if (urlSegments && urlSegments.length > 0) {
        this.resource = urlSegments[urlSegments.length-1].toString();
        if (this.resource.toLowerCase().endsWith('.html')) {
          this.resource = this.resource.slice(0, -5);
        }
        if (this.resource === '' || this.resource === undefined || this.resource === null) {
          this.resource = environment.indexPageSelector;
        }
        this.structure$ = this.actions.showWidget(this.resource);
      }
    });
  }
}
