import { Component, OnInit, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { IWidgetNavMenuInterface } from 'src/app/interfaces/widgets/nav-menu.interface';
import { IPageTreeNodeInterface } from 'src/app/interfaces/page-tree-node.interface';

interface INode {
  name: string;
  children?: INode[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
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
    };
  }

  @Input()
  widget:IWidgetNavMenuInterface;

  data: INode[] = [];
  /*[
    {
      name: 'Fruit',
      children: [
        {name: 'Apple'},
        {name: 'Banana'},
        {name: 'Fruit loops'},
      ]
    }, 
  ];
  */
  

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
  }

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
    widgetNodes.forEach((node: IPageTreeNodeInterface) => {
      const dataNode: INode = {name: node.name};
      data.push(dataNode);
      if (node.children) {
        dataNode.children = [];
        this.fillData(dataNode.children, node.children);
      }
    });
  }

  

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
