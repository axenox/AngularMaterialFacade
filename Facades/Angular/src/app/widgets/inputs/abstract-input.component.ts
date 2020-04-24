import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IWidgetInputInterface } from '../../interfaces/widgets/input.interface';
import { IWidgetEvent, WidgetEventType } from '../../interfaces/events/widget-event.interface';
import { FormGroup, FormControl } from '@angular/forms';

const ERROR_MESSAGES= {
'required': 'You must enter a value'
}

export class AbstractInputComponent  {

  @Input()
  widget: IWidgetInputInterface;

  @Input()
  formGroup: FormGroup;

  @Input()
  pageSelector: string;
  
  @Output()
  widgetEvent = new EventEmitter<IWidgetEvent>();

  onChange(value: string) {
    const widgetEvent: IWidgetEvent = { source: this.widget, type: WidgetEventType.VALUE_CHANGED, value};
    this.widgetEvent.emit(widgetEvent);
  }

  onKeyUp(event: KeyboardEvent) {
    const widgetEvent: IWidgetEvent = { source: this.widget, type: WidgetEventType.KEYPRESSED, value: event.code};
    this.widgetEvent.emit(widgetEvent);
  }

  hasError(): boolean {
    const control = this.getControl();
    return control && control.invalid && (control.dirty || control.touched);
  }  

  /**
 * get Array of translated Errors
 */
  getTranslatedErrors(): string[] {
    const control = this.getControl();
    const result: string[] = [];
    if (control) {
      for (const error of Object.keys(control.errors)) {
        //const message = ERROR_MESSAGES[error] || error;
        const message = this.widget.validation_error_text;
        result.push(message);
      } 
    }
    return result;
  }

  getControl() {
    return this.formGroup.get(this.widget.attribute_alias);
  }
}
