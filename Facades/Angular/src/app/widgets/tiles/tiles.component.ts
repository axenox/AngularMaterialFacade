import { Component, OnInit } from '@angular/core';
import { IWidgetTilesInterface } from 'src/app/interfaces/widgets/tiles.interface';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.css']
})
export class TilesComponent implements OnInit {

  widget: IWidgetTilesInterface

  constructor() { }

  ngOnInit(): void {
  }

}
