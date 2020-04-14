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
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import { PageComponent } from './page/page.component';
import { WidgetComponent } from './widgets/widget.component';
import { CdkTableModule } from '@angular/cdk/table';
import { DialogComponent } from './widgets/dialog/dialog.component';
import { SnackbarTestComponent } from './snackbar-test/snackbar-test.component';
import { FilterComponent } from './widgets/filter/filter.component';
import { InputComponent } from './widgets/input/input.component';
import { InputSelectComponent } from './widgets/input-select/input-select.component';
import { ButtonComponent } from './widgets/button/button.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MdePopoverModule } from '@material-extended/mde';
import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatMenuModule} from '@angular/material/menu';
import { HostDirective } from './widgets/host.directive';
import { ContainerComponent } from './widgets/container/container.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { InputTextComponent } from './widgets/input-text/input-text.component';
import { FormComponent } from './widgets/form/form.component';

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    WidgetComponent,
    PageComponent,
    DialogComponent,
    SnackbarTestComponent,
    FilterComponent,
    InputComponent,
    InputSelectComponent,
    ButtonComponent,
    HostDirective,
    ContainerComponent,
    InputTextComponent,
    FormComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CdkTableModule,
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
    ReactiveFormsModule
  ],
  entryComponents: [
    DialogComponent,
    SnackbarTestComponent,
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
