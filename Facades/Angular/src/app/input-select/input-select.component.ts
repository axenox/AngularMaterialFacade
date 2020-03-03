import { Component, OnInit, Input } from '@angular/core';
import { IWidgetInputSelectInterface } from '../widgets/interfaces/input-select.interface';

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.css']
})
export class InputSelectComponent implements OnInit {
  
  @Input()
    config: IWidgetInputSelectInterface;

  constructor() { }

  ngOnInit() {
  }

}
