import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventEmitter } from 'protractor';
import { AbstractInputComponent } from '../inputs/abstract-input.component';
import { IWidgetDisplayInterface } from 'src/app/interfaces/widgets/display.interface';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent {

  @Input()
  widget: IWidgetDisplayInterface;

  @Input()
  formGroup: FormGroup;

  @Input()
  pageSelector: string;

  getControl() {
    return this.formGroup.get(this.widget.attribute_alias);
  }

  getControlValue(){
    const control = this.getControl();
    if(control){
      return control.value;
    }
  }
}

