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

@Component({
  selector: 'app-widget',
  template: '<ng-template #content></ng-template>'
})
export class WidgetComponent implements OnInit, OnChanges {
  @Input()
  structure: IWidgetInterface;

  @Input()
  pageSelector: string;

  @ViewChild('content', { read: ViewContainerRef, static: true })
  content: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    const component: Type<any> = DataTableComponent;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef: ComponentRef<any> = this.content.createComponent(componentFactory);
    componentRef.instance.widget = this.structure;
    componentRef.instance.pageSelector = this.pageSelector;
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

}
