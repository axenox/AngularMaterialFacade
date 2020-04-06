import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IWidgetFilter } from '../interfaces/widgets/filter.interface';
import { IWidgetEvent } from '../interfaces/events/widget-event.interface';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input()
  widget: IWidgetFilter;

  @Output()
  widgetEvent = new EventEmitter<IWidgetEvent>();
  
  constructor() { }

  ngOnInit() {
  }

  onWidgetEvent(event: IWidgetEvent) {
    this.widgetEvent.emit(event);
  }

}
