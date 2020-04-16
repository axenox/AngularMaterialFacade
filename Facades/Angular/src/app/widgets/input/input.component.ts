import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IWidgetInputInterface } from '../../interfaces/widgets/input.interface';
import { IWidgetEvent, WidgetEventType } from '../../interfaces/events/widget-event.interface';
import { FormGroup } from '@angular/forms';

const ERROR_MESSAGES= {
'required': 'You must enter a value'
}


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input()
  widget: IWidgetInputInterface;

  @Input()
  formGroup: FormGroup;
  
  @Output()
  widgetEvent = new EventEmitter<IWidgetEvent>();

  ngOnInit() {}

  onChange(value: string) {
    const widgetEvent: IWidgetEvent = { source: this.widget, type: WidgetEventType.VALUE_CHANGED, value};
    this.widgetEvent.emit(widgetEvent);
  }

  onKeyUp(event: KeyboardEvent) {
    const widgetEvent: IWidgetEvent = { source: this.widget, type: WidgetEventType.KEYPRESSED, value: event.code};
    this.widgetEvent.emit(widgetEvent);
  }

  hasError(property: string): boolean {
    const control = this.formGroup.get(property);
    return control && control.invalid && (control.dirty || control.touched);
  }  

  /**
 * get Array of translated Errors
 */
  getTranslatedErrors(property: string): string[] {
    const control = this.formGroup.get(property);
    const result: string[] = [];
    if (control) {
      for (const error of Object.keys(control.errors)) {
        const message = ERROR_MESSAGES[error] || error;
        result.push(message);
      } 
    }
    return result;
  }
}
