import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  imgPath1 : string;
  imgPathRedesigne : string;
  redesigned : string;
  imgPath2 : string;
  imgPath3 : string;
  constructor() { }

  ngOnInit() {
    this.imgPath1 = "assets/img/wideHeader.png";
    this.imgPathRedesigne = "assets/img/wideHeaderRedesigne.png";
    this.redesigned = "assets/img/redesigned.png";
    this.imgPath2 = "assets/img/meme1.jpg";
    this.imgPath3 = "assets/img/meme2.jpg";
  }

}
