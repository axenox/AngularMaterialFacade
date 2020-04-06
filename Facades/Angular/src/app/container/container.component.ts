import { Component, OnInit, Input } from '@angular/core';
import { IWidgetContainer } from '../interfaces/widgets/container.interface';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  @Input()
  widget: IWidgetContainer

  constructor() { }

  ngOnInit(): void {
  }

}
