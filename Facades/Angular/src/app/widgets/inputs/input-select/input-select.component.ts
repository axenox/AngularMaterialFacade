import { Component, Input } from '@angular/core';
import { AbstractInputComponent } from '../abstract-input.component';
import { IWidgetInputSelectInterface } from 'src/app/interfaces/widgets/input-select.interface';

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.css']
})
export class InputSelectComponent extends AbstractInputComponent {
  @Input()
  widget: IWidgetInputSelectInterface;
}
