import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IWidgetDataTable } from '../widgets/interfaces/data-table.interface';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @Output()
    filterChange= new EventEmitter<string>();

  @Input()
    filter: any;

    applyFilter(event: Event) {

      const filterValue = (event.target as HTMLInputElement).value;
      this.filter._global_ = filterValue.trim().toLowerCase();
      this.filterChange.emit(JSON.stringify(this.filter));
    }

  constructor(private router: Router){  }

  ngOnInit() {
  }

}
