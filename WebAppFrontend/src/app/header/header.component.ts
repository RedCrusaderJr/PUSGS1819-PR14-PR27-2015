import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  imgPath : string;
  constructor() { }

  ngOnInit() {
    this.imgPath = "assets/img/WebAppHeader.png";
  }

}
