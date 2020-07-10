import {
  Component,
} from '@angular/core';
import { DataTableComponent } from './data-table.component';

@Component({
  selector: 'app-responsive-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css', './responsive-data-table.css']
})

export class ResponsiveDataTableComponent extends DataTableComponent {}