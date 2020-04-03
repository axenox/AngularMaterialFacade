import { Component, OnInit, Input } from '@angular/core';
import { IWidgetInputSelectInterface } from '../interfaces/widgets/input-select.interface';

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.css']
})
export class InputSelectComponent implements OnInit {
  
  @Input()
    widget: IWidgetInputSelectInterface;

  @Input()
    filter: any;

  constructor() { }

  ngOnInit() {
  }

  onRefresh(){
    console.log("works")
  }

}
