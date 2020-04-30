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
import { InputComponent } from './inputs/input/input.component';
import { InputSelectComponent } from './inputs/input-select/input-select.component';
import { IWidgetEvent } from '../interfaces/events/widget-event.interface';
import { ContainerComponent } from './container/container.component';
import { FormGroup } from '@angular/forms';
import { InputTextComponent } from './inputs/input-text/input-text.component';
import { FormComponent } from './form/form.component';
import { InputComboComponent } from './inputs/input-combo/input-combo.component';
import { TabsComponent } from './tabs/tabs.component';
import { InputCheckBoxComponent } from './inputs/input-checkbox/input-checkbox.component';

const COMPONENT_REGISTER = {
  'DataTable': DataTableComponent,
  'Filter': FilterComponent,
  'Input': InputComponent,
  'InputSelect': InputSelectComponent,
  'InputText': InputTextComponent,
  'Dialog': ContainerComponent,
  'Form': FormComponent,
  'InputCombo': InputComboComponent,
  'Tabs': TabsComponent,
  'Tab': ContainerComponent,
  'WidgetGroup': FormComponent,
  'InputCheckBox' : InputCheckBoxComponent,
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
      const component: Type<any> = this.getComponent();
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

  getComponent() {
    const widgetType = this.structure.widget_type;
    let component = COMPONENT_REGISTER[widgetType];
    if (!component && widgetType !== 'InputHidden'){
      for(let type of this.structure.fallback_widgets) {
        component = COMPONENT_REGISTER[type];
        if (component) {
          return component;
        }
      }
    }
    return component;
  }

  onWidgetEvent(event: IWidgetEvent) {
    this.widgetEvent.emit(event);
  }
}
