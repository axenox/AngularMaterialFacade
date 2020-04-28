import { Component, OnInit, Input } from '@angular/core';
import { IWidgetContainer } from '../../interfaces/widgets/container.interface';
import { FormGroup } from '@angular/forms';
import { IWidgetInputInterface } from 'src/app/interfaces/widgets/input.interface';
import { IWidgetForm } from 'src/app/interfaces/widgets/form.interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

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
    if (w.widget_type==='InputText') {
      classes['item--width--full']=true;
    } else {
      classes['item'+ this.widget.columns_in_grid]=true;
    }
    return classes;
  }

}
