import { Component, OnInit } from '@angular/core';
import { IWidgetTilesInterface } from 'src/app/interfaces/widgets/tiles.interface';
import { IActionGoToPage } from 'src/app/interfaces/actions/go-to-page.interface';
import { IWidgetTileInterface } from 'src/app/interfaces/widgets/tile.interface';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.css']
})
export class TilesComponent implements OnInit {

  widget: IWidgetTilesInterface

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onClick(tile: IWidgetTileInterface){
    const action = tile.action;
    if(this.isActionGoToPage(action)){
      this.onClickGoToPage(action as IActionGoToPage);
    }
  }

  isActionGoToPage(object: any): object is IActionGoToPage {
    return 'page_alias' in object;
  }

  onClickGoToPage(action: IActionGoToPage) {
    this.router.navigateByUrl('/page/' + action.page_alias );
  }

}
