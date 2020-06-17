import { Component, OnInit, OnDestroy } from '@angular/core';
import { IShell, IContextBar } from './interfaces/shell-interface';
import { Actions } from './api/actions.interface';
import { ActionsService } from './api/actions.service';
import { Subscription } from 'rxjs';
import { IWidgetButton } from './interfaces/widgets/button.interface';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IActionGoToPage } from './interfaces/actions/go-to-page.interface';
import { ThemeService } from './api/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ExFace';

  shell: IShell;
  subscriptions: Subscription[] = [];

  constructor(private actions: ActionsService, private readonly themeService: ThemeService) {}

  ngOnInit() {
    this.subscriptions.push(this.actions.callShellAction().subscribe((shell: IShell) => {
      this.shell = shell;
      let themePath = this.shell.theme;
      if (themePath.startsWith('@angular/material/prebuilt-themes/')) {
        themePath = themePath.replace('@angular/material/prebuilt-themes/', '/assets/themes/');
      }
      this.themeService.setTheme(themePath);
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs: Subscription) => subs.unsubscribe());
  }

  getContextBars(): IContextBar[] {
    if (!this.shell || !this.shell.context_bar) {
      return [];
    }

    return Object.values(this.shell.context_bar)
  }

  themeChangeHandler(themeToSet) {
    this.themeService.setTheme(themeToSet);
  }

 
}
