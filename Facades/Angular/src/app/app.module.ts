import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule} from '@angular/material/table';
import { DataTableComponent } from './widgets/data-table/data-table.component';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { PageComponent } from './page/page.component';
import { WidgetComponent } from './widgets/widget.component';
import { CdkTableModule } from '@angular/cdk/table';
import { DialogComponent } from './widgets/dialog/dialog.component';
import { FilterComponent } from './widgets/filter/filter.component';
import { InputComponent } from './widgets/inputs/input/input.component';
import { InputSelectComponent } from './widgets/inputs/input-select/input-select.component';
import { ButtonComponent } from './widgets/button/button.component';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MdePopoverModule } from '@material-extended/mde';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { HostDirective } from './widgets/host.directive';
import { ContainerComponent } from './widgets/container/container.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InputTextComponent } from './widgets/inputs/input-text/input-text.component';
import { FormComponent } from './widgets/form/form.component';
import { ActionsService } from './api/actions.service';
import { apiFactory } from './api/api-factory';
import { InputComboComponent } from './widgets/inputs/input-combo/input-combo.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HiddenControlValidatorDirective } from './widgets/inputs/input-combo/hidden-control-validator.directive';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsComponent } from './widgets/tabs/tabs.component';
import { LoadingScreenInterceptor } from './components/loading-screen/loading-screen.interceptor';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { InputCheckBoxComponent } from './widgets/inputs/input-checkbox/input-checkbox.component';
import { MatTreeModule } from '@angular/material/tree';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NavMenuComponent } from './widgets/nav-menu/nav-menu.component';
import { ExternalPageComponent } from './external-page/external-page.component';
import { NavTilesComponent } from './widgets/nav-tiles/nav-tiles.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { TilesComponent } from './widgets/tiles/tiles.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule} from '@angular/material/sidenav';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatBadgeModule } from '@angular/material/badge';
import { StyleManagerService } from './api/style-manager.service';
import { ThemeService } from './api/theme.service';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoginPromptComponent } from './widgets/login-prompt/login-prompt.component';
import { InputPasswordComponent } from './widgets/inputs/input-password/input-password.component';
import { ImageComponent } from './widgets/image/image.component';
import { QrCodeComponent } from './widgets/qr-code/qr-code.component';
import { DisplayComponent } from './widgets/display/display.component';
import { ResponsiveDataTableComponent } from './widgets/data-table/responsive-data-table.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, '../assets/i18n/');
}

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    WidgetComponent,
    PageComponent,
    DialogComponent,
    FilterComponent,
    InputComponent,
    InputSelectComponent,
    ButtonComponent,
    HostDirective,
    ContainerComponent,
    InputTextComponent,
    FormComponent,
    InputComboComponent,
    HiddenControlValidatorDirective,
    TabsComponent,
    LoadingScreenComponent,
    InputCheckBoxComponent,
    NavMenuComponent,
    ExternalPageComponent,
    NavTilesComponent,
    TilesComponent,
    LoginPromptComponent,
    InputPasswordComponent,
    ImageComponent,
    QrCodeComponent,
    DisplayComponent,
    ResponsiveDataTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CdkTableModule,
    CdkTreeModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    MatButtonModule,
    MatExpansionModule,
    MatDialogModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSelectModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MdePopoverModule,
    MatCardModule,
    FlexLayoutModule,
    MatMenuModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTreeModule,
    MatGridListModule,
    MatRippleModule,
    MatDividerModule,
    MatSidenavModule,
    ScrollingModule,
    MatBadgeModule,
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] },
    }),
  ],
  entryComponents: [
    DialogComponent, 
    ButtonComponent,
    LoginPromptComponent
  ],

  providers: [
    {provide: ActionsService, useFactory: apiFactory, deps: [HttpClient, TranslateService]},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingScreenInterceptor,
      multi: true,
    },
    StyleManagerService, ThemeService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
