import { Component, OnInit, Input } from '@angular/core';
import { IWidgetNavTilesInterface } from 'src/app/interfaces/widgets/nav-tiles.interface';
import { IWidgetTileInterface } from 'src/app/interfaces/widgets/tile.interface';

@Component({
  selector: 'app-nav-tiles',
  templateUrl: './nav-tiles.component.html',
  styleUrls: ['./nav-tiles.component.css']
})
export class NavTilesComponent implements OnInit {

  @Input()
  widget: IWidgetNavTilesInterface

  constructor() { }

  ngOnInit(): void {
  }

}
