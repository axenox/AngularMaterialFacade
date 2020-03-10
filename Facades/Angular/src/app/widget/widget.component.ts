import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnChanges,
  OnInit, SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DataTableComponent } from '../data-table/data-table.component';
import { IWidgetInterface } from '../interfaces/widgets/widget.inteface';
import { FilterComponent } from '../filter/filter.component';

const COMPONENT_REGISTER={
  'DataTable':DataTableComponent,
  'Filter':FilterComponent,
}

@Component({
  selector: 'app-widget',
  template: '<ng-template #content></ng-template>'
})
export class WidgetComponent implements OnInit, OnChanges {
  @Input()
  structure: IWidgetInterface;

  @Input()
  pageSelector: string;

  @Input()
  filter: any;

  @ViewChild('content', { read: ViewContainerRef, static: true })
  content: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    const component: Type<any> = this.getComponent(this.structure.widget_type);
    if(component){
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      const componentRef: ComponentRef<any> = this.content.createComponent(componentFactory);
      componentRef.instance.widget = this.structure;
      componentRef.instance.pageSelector = this.pageSelector;
      if(this.filter){
        componentRef.instance.filter = this.filter;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('change');
  }

  getComponent(widgetType:string){
    return COMPONENT_REGISTER[widgetType];
  }
}
