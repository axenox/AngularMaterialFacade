import { Component, OnInit, Input } from '@angular/core';
import { IWidgetLoginPrompt } from 'src/app/interfaces/widgets/login-prompt.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login-prompt',
  templateUrl: './login-prompt.component.html',
  styleUrls: ['./login-prompt.component.css']
})
export class LoginPromptComponent implements OnInit {

  constructor() { }

  @Input()
  widget: IWidgetLoginPrompt;

  @Input()
  pageSelector: string;

  @Input()
  formGroup: FormGroup;

  ngOnInit(): void {
  }
  
}
