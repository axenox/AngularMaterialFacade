import { Component, OnInit, Input } from '@angular/core';
import { IWidgetImageInterface } from 'src/app/interfaces/widgets/image.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {

  @Input()
  widget: IWidgetImageInterface;

  @Input()
  formGroup: FormGroup;

  constructor() { }

  getControl() {
    return this.formGroup.get(this.widget.attribute_alias);
  }

  getControlValue(){
    const control = this.getControl();
    if(control){
      const url = this.widget.base_url_absolute + control.value
      return url;
    }
  }

}
