import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IWidgetInputSelectInterface } from '../interfaces/widgets/input-select.interface';
import { IWidgetEvent, WidgetEventType } from '../interfaces/events/widget-event.interface';

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.css']
})
export class InputSelectComponent implements OnInit {
  
  @Input()
    widget: IWidgetInputSelectInterface;

  @Output()
    widgetEvent = new EventEmitter<IWidgetEvent>();

  value: string;

  ngOnInit() {}

  onChange(value: string) {
    const widgetEvent: IWidgetEvent = { source: this.widget, type: WidgetEventType.VALUE_CHANGED, value};
    this.widgetEvent.emit(widgetEvent);
  }

  onKeyUp(event: KeyboardEvent) {
    const widgetEvent: IWidgetEvent = { source: this.widget, type: WidgetEventType.KEYPRESSED, value: event.code};
    this.widgetEvent.emit(widgetEvent);
  }
}
