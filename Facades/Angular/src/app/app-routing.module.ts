import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import {FormComponent} from './form/form.component';
import { LogTableComponent } from './log-table/log-table.component';



const routes: Routes = [
  {path: '', redirectTo: '/log-table', pathMatch: 'full'},
  {path: 'table', component: DataTableComponent},
  {path: 'log-table', component: LogTableComponent},
  {path: 'form', component: FormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
