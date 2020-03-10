import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { PageComponent } from './page/page.component';

const routes: Routes = [
  {path: '', redirectTo: '/page/angular-test', pathMatch: 'full'},
  {path: 'table', component: DataTableComponent},
  {path: 'page/:pageSelector', component: PageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
