import { Component, OnInit, Input } from '@angular/core';
import { IWidgetTab } from 'src/app/interfaces/widgets/tab.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  constructor() { }

  @Input() 
  pageSelector: string;

  @Input()
  widget: IWidgetTab;

  @Input()
  formGroup: FormGroup;

  ngOnInit(): void {
    if (!this.formGroup){
      this.formGroup = new FormGroup({});
    }
  }

}
