import { Component, OnInit, Input } from '@angular/core';
import { IWidgetInputInterface } from '../interfaces/widgets/input.interface';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input()
    widget: IWidgetInputInterface;
  
  @Input()
    filter: any;

  constructor() { }

  ngOnInit() {
  }

}
