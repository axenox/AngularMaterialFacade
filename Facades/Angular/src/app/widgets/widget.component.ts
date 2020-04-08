import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  Type,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { DataTableComponent } from './data-table/data-table.component';
import { IWidgetInterface } from '../interfaces/widgets/widget.interface';
import { FilterComponent } from './filter/filter.component';
import { HostDirective } from './host.directive';
import { InputComponent } from './input/input.component';
import { InputSelectComponent } from './input-select/input-select.component';
import { IWidgetEvent } from '../interfaces/events/widget-event.interface';
import { ContainerComponent } from './container/container.component';
import { FormControl, FormGroup } from '@angular/forms';

const COMPONENT_REGISTER = {
  DataTable: DataTableComponent,
  Filter: FilterComponent,
  Input: InputComponent,
  InputSelect: InputSelectComponent,
  Dialog: ContainerComponent,
  Form: ContainerComponent
};

@Component({
  selector: 'app-widget',
  template: '<ng-template app-host></ng-template>',
  // templateUrl: './widget.component.html'
})
export class WidgetComponent implements OnInit, OnChanges {
  @Input()
  structure: IWidgetInterface;

  @Input()
  pageSelector: string;

  @Output()
  widgetEvent = new EventEmitter<IWidgetEvent>();

  @Input()
  formGroup: FormGroup;

/*
  @ViewChild('content', { read: ViewContainerRef, static: true })
  content: ViewContainerRef;*/
  
  @ViewChild(HostDirective, {static: true}) appHost: HostDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.structure && this.structure) {
      const widgetType = this.structure.widget_type;
      const component: Type<any> = this.getComponent(widgetType);
      if (component) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        const viewContainerRef = this.appHost.viewContainerRef;
        const componentRef: ComponentRef<any> = viewContainerRef.createComponent(componentFactory);
        componentRef.instance.widget = this.structure;
        componentRef.instance.pageSelector = this.pageSelector;
        
        if (this.formGroup) {
          componentRef.instance.formGroup = this.formGroup;
        }

        if (componentRef.instance.widgetEvent) {
          componentRef.instance.widgetEvent.subscribe(
            (event: IWidgetEvent) => this.onWidgetEvent(event)
          );
        }
      }
    }
  }

  getComponent(widgetType: string) {
    const component = COMPONENT_REGISTER[widgetType];
    if (!component && widgetType.startsWith('Input')){
      return InputComponent;
    }
    return component;
  }

  onWidgetEvent(event: IWidgetEvent) {
    this.widgetEvent.emit(event);
  }
}
