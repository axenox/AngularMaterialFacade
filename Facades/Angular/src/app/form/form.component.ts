import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { IWidgetDataTable } from '../widgets/interfaces/data-table.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @Input()
    dataSource: MatTableDataSource<any>;

  @Input()
    config: IWidgetDataTable;
  
    filter={_global_: ''};

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.filter._global_ = filterValue.trim().toLowerCase();
      this.dataSource.filter = JSON.stringify(this.config.filters);
    }

  constructor(private router: Router){  }

  ngOnInit() {
  }

}
