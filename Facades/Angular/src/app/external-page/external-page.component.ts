import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-external-page',
  templateUrl: './external-page.component.html',
  styleUrls: ['./external-page.component.css']
})
export class ExternalPageComponent implements OnInit {

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const url = params.get('url');
      document.getElementById("content").innerHTML=`<object type="type/html" data="${url}" ></object>`;
    });
  }

}
