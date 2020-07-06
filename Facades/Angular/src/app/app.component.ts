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
import { TranslateService } from '@ngx-translate/core';
import { IWidgetLoginPrompt } from './interfaces/widgets/login-prompt.interface';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { IDialogData, DialogComponent } from './widgets/dialog/dialog.component';
import { IWidgetDialog } from './interfaces/widgets/dialog.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ExFace';

  shell: IShell;

  loginWidget: IWidgetLoginPrompt;

  subscriptions: Subscription[] = [];
    
  constructor(private translate: TranslateService,private actions: ActionsService, private readonly themeService: ThemeService, private dialog: MatDialog) {
    const browserLanguage = translate.getBrowserLang();
    if (browserLanguage === 'de') {
      translate.addLangs(['de', 'en']);
    } else {
      translate.addLangs(['en', 'de']);
    }
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('de');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(browserLanguage);
  }


  ngOnInit() {
    this.subscriptions.push(this.actions.callShellAction().subscribe((result: IShell | IWidgetLoginPrompt) => {
      if ('widgets' in result) {
        this.loginWidget = result;
        let hasTabs = false;
        if(this.loginWidget.widgets.length >= 2){
          hasTabs = true
        }
        const dialogConfig = new MatDialogConfig();
        const dialogData: IDialogData = { structure: (this.loginWidget.widgets[0] as IWidgetDialog), pageSelector: '' };

        dialogConfig.data = dialogData;
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        
        if(hasTabs = true){
          const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {});
        } else {
          const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
          dialogRef.afterClosed().subscribe(result => {});
        }
      } else {
        this.shell = result;
        let themePath = this.shell.theme;
        if (themePath.startsWith('@angular/material/prebuilt-themes/')) {
          themePath = themePath.replace('@angular/material/prebuilt-themes/', 'assets/themes/');
        } 
        this.themeService.setTheme(themePath);
      }
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
