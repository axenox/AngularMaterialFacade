import { Component, OnInit, Input } from '@angular/core';
import { IWidgetFilter } from '../data-table/data-table-structure.interface';

@Component({
  selector: 'app-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.css']
})
export class FilterInputComponent implements OnInit {

  @Input()
    config: IWidgetFilter;

  @Input()
    filter: any;

    constructor() { }

  ngOnInit() {
  }

}
