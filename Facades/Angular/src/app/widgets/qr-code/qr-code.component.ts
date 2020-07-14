import { Component, OnInit, Input } from '@angular/core';
import { IWidgetImageInterface } from 'src/app/interfaces/widgets/image.interface';
import { FormGroup } from '@angular/forms';
import { IWidgetQrCodeInterface } from 'src/app/interfaces/widgets/qr-code.interface';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.css']
})
export class QrCodeComponent {

  @Input()
  widget: IWidgetQrCodeInterface;

  @Input()
  formGroup: FormGroup;

  getControl() {
    return this.formGroup.get(this.widget.attribute_alias);
  }

  getControlValue(){
    const control = this.getControl();
    if(control){
      return control.value;
    }
  }
}
