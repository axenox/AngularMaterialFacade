import { Component, OnInit } from '@angular/core';
import { IWidgetTilesInterface } from 'src/app/interfaces/widgets/tiles.interface';
import { IActionGoToPage } from 'src/app/interfaces/actions/go-to-page.interface';

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

  onClick(){
    const action = this.widget.widgets
    if(this.isActionGoToPage(action)){
      this.onClickGoToPage(action as IActionGoToPage);
    }
  }

  isActionGoToPage(object: any): object is IActionGoToPage {
    return 'page_alias' in object;
  }

  onClickGoToPage(action: IActionGoToPage) {
    document.location.href = 'page/' + action.page_alias;
  }

}
