import { Component, OnInit, Input } from '@angular/core';
import { IWidgetContainer } from '../../interfaces/widgets/container.interface';
import { FormGroup } from '@angular/forms';
import Masonry from 'masonry-layout'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @Input()
  widget: IWidgetContainer

  @Input()
  formGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
    const grid = document.querySelector('.grid'); 
    const msnry = new Masonry(grid, {
      itemSelector: '.grid-item',
      columnWidth: '.grid-sizer',
      percentPosition: true
    });

    msnry.layout();
  }

}
