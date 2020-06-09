import { Component, OnInit, OnDestroy } from '@angular/core';
import { IShell } from './interfaces/shell-interface';
import { Actions } from './api/actions.interface';
import { ActionsService } from './api/actions.service';
import { Subscription } from 'rxjs';
import { IWidgetButton } from './interfaces/widgets/button.interface';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ExFace';

  shell: IShell;
  subscriptions: Subscription[] = [];

  constructor(private actions: ActionsService) {}

  ngOnInit() {
    this.subscriptions.push(this.actions.callShellAction().subscribe((shell: IShell) => 
      this.shell = shell
    ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs: Subscription) => subs.unsubscribe());
  }
}
