import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataTableComponent } from './widgets/data-table/data-table.component';
import { PageComponent } from './page/page.component';
import { ExternalPageComponent } from './external-page/external-page.component';

const routes: Routes = [
  {path: '**', component: PageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
