import { Component, OnInit } from '@angular/core';
import { AbstractInputComponent } from '../abstract-input.component';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.css']
})
export class InputPasswordComponent extends AbstractInputComponent {

}
