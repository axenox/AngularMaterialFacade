import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IWidgetFilter } from '../../interfaces/widgets/filter.interface';
import { IWidgetEvent } from '../../interfaces/events/widget-event.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input()
  widget: IWidgetFilter;

  @Input()
  formGroup: FormGroup;

  @Output()
  widgetEvent = new EventEmitter<IWidgetEvent>();

  @Input()
  pageSelector: string;
  
  constructor() { }

  ngOnInit() {
  }

  onWidgetEvent(event: IWidgetEvent) {
    this.widgetEvent.emit(event);
  }

}
