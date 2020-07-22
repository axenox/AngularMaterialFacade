import { Component, OnInit, Input } from '@angular/core';
import { IWidgetContainer } from '../../interfaces/widgets/container.interface';
import { FormGroup } from '@angular/forms';
import { IWidgetInputInterface } from 'src/app/interfaces/widgets/input.interface';
import { IWidgetForm } from 'src/app/interfaces/widgets/form.interface';

@Component({
  selector: 'app-widget-grid',
  templateUrl: './widget-grid.component.html',
  styleUrls: ['./widget-grid.component.css']
})
export class WidgetGridComponent implements OnInit {

  @Input()
  widget: IWidgetForm;

  @Input()
  formGroup: FormGroup;

  @Input()
  pageSelector: string;

  constructor() { }

  ngOnInit(): void {}

  getWidgetClasses(w: IWidgetInputInterface) {
    const classes = {};
    if (this.widget.columns_in_grid === 1) {
      classes['item--width--full'] = true;
    } else {
      classes['item'+ this.widget.columns_in_grid] = true;
    }
    return classes;
  }

  getGridTemplateColumns() {
    var sResult = '';
    for (var i=0; i < this.widget.columns_in_grid; i++) {
      sResult += 'auto ';
    }
    return sResult;
  }

}
