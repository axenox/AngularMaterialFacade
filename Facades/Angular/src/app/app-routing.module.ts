import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { LogTableComponent } from './log-table/log-table.component';

const routes: Routes = [
  {path: '', redirectTo: '/page', pathMatch: 'full'},
  {path: 'table', component: DataTableComponent},
  {path: 'page/:pageSelector', component: LogTableComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
