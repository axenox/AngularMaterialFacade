import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IWidgetInputInterface } from '../../interfaces/widgets/input.interface';
import { IWidgetEvent, WidgetEventType } from '../../interfaces/events/widget-event.interface';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input()
  widget: IWidgetInputInterface;
  
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
