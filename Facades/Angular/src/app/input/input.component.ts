import { Component, OnInit, Input } from '@angular/core';
import { IWidgetInputInterface } from '../widgets/interfaces/input.interface';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  @Input()
    config: IWidgetInputInterface;
  
  constructor() { }

  ngOnInit() {
  }

}
