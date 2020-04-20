import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-combo-table',
  templateUrl: './input-combo-table.component.html',
  styleUrls: ['./input-combo-table.component.css']
})
export class InputComboTableComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];


  constructor() { }

  ngOnInit(): void {
  }

}
