import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IWidgetInputTextInterface } from 'src/app/interfaces/widgets/input-text.interface';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css']
})
export class InputTextComponent implements OnInit {
  
  @Input()
  widget:IWidgetInputTextInterface;

  @Input()
  formGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
