import { Component, OnInit, Input, Output } from '@angular/core';
import { IWidgetEvent, WidgetEventType } from 'src/app/interfaces/events/widget-event.interface';
import { IWidgetInputInterface } from 'src/app/interfaces/widgets/input.interface';
import { FormGroup } from '@angular/forms';
import { EventEmitter } from 'protractor';
import { AbstractInputComponent } from '../inputs/abstract-input.component';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent extends AbstractInputComponent {

}

