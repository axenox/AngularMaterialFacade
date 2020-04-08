import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.resource = params.get('pageSelector');
      this.structure$ = this.actions.showWidget(this.resource);
    });
  }
}
