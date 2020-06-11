import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { IWidgetNavMenuInterface } from 'src/app/interfaces/widgets/nav-menu.interface';
import { IPageTreeNodeInterface } from 'src/app/interfaces/page-tree-node.interface';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IActionGoToPage } from 'src/app/interfaces/actions/go-to-page.interface';

interface INode {
  name: string;
  url: string; 
  page_alias: string;
  children?: INode[];
 
}

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  private _transformer = (node: INode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      url: node.url,
      page_alias: node.page_alias
    };
  }

  @ViewChild("content") content: ElementRef;

  @Input()
  widget:IWidgetNavMenuInterface;

  url: SafeResourceUrl;

  data: INode[] = [];

  treeControl = new FlatTreeControl<FlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (this.widget.nav_menu){
      this.fillData(this.data, this.widget.nav_menu);
    }
    this.dataSource.data = this.data;
  }

  /**
   * 
   * @param data the array that has to be filled in the mat-tree structure
   * @param widgetNodes the array with the widget data from server
   */
  fillData(data: INode[], widgetNodes: IPageTreeNodeInterface[]) {
    widgetNodes.forEach((widgetNode: IPageTreeNodeInterface) => {
      const dataNode: INode = {name: widgetNode.name, url:widgetNode.url, page_alias:widgetNode.page_alias};
      data.push(dataNode);
      if (widgetNode.children) {
        dataNode.children = [];
        this.fillData(dataNode.children, widgetNode.children);
      }
    });
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  onNavigate(node: INode){
    // window.location.href=node.url;
    // this.router.navigate(['/ext-page', { url: node.url }])
    // this.content.nativeElement.innerHTML=`<object type="type/html" data="${node.url}" ></object>`;
    // this.content.nativeElement.src = node.url;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(node.url);
  }

  onClickGoToPage(node: INode) {
    document.location.href = 'page/' + node.page_alias;
  }
}
