import { Component, OnInit, Input } from '@angular/core';
import { IWidgetContainer } from '../../interfaces/widgets/container.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  @Input()
  widget: IWidgetContainer

  @Input()
  formGroup: FormGroup;

  @Input()
  pageSelector: string;

  constructor() { }

  ngOnInit(): void {
    if (!this.formGroup) {
      this.formGroup=new FormGroup({});
    }
  }

}
