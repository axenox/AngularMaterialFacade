import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule} from '@angular/material/table';
import { DataTableComponent } from './data-table/data-table.component';
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
import { FormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import { PageComponent } from './page/page.component';
import { WidgetComponent } from './widget/widget.component';
import { CdkTableModule } from '@angular/cdk/table';
import { DialogTestComponent } from './dialog-test/dialog-test.component';
import { SnackbarTestComponent } from './snackbar-test/snackbar-test.component';
import { FilterComponent } from './filter/filter.component';
import { InputComponent } from './input/input.component';
import { InputSelectComponent } from './input-select/input-select.component';
import { ButtonComponent } from './button/button.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    WidgetComponent,
    PageComponent,
    DialogTestComponent,
    SnackbarTestComponent,
    FilterComponent,
    InputComponent,
    InputSelectComponent,
    ButtonComponent

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
    MatProgressSpinnerModule
  ],
  entryComponents: [
    DialogTestComponent,
    SnackbarTestComponent,
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
