import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule} from '@angular/material/table';
import { DataTableComponent } from './data-table/data-table.component';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormComponent } from './form/form.component';
import { MatInputModule, MatOptionModule, MatSelectModule, MatChipsModule, MatButtonModule, MatDialogModule, MatProgressBarModule, MatSnackBarModule, MatTooltipModule, MatPaginatorModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import { LogTableComponent } from './log-table/log-table.component';
import { ExampleTableComponent } from './example-table/example-table.component';
import { CdkTableModule } from '@angular/cdk/table';
import { DialogTestComponent } from './dialog-test/dialog-test.component';
import { SnackbarTestComponent } from './snackbar-test/snackbar-test.component';


@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    FormComponent,
    LogTableComponent,
    ExampleTableComponent,
    DialogTestComponent,
    SnackbarTestComponent,
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
    MatPaginatorModule
  ],
  entryComponents: [
    DialogTestComponent,
    SnackbarTestComponent,
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
