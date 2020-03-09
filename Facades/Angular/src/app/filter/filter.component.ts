import { Component, OnInit, Input } from '@angular/core';
import { IWidgetFilter } from '../interfaces/widgets/filter.interface';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input()
    widget: IWidgetFilter;

  @Input()
    filter: any;
  
  constructor() { }

  ngOnInit() {
  }

}
