import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-option-bar',
  templateUrl: './option-bar.component.html',
  styleUrls: ['./option-bar.component.css']
})
export class OptionBarComponent implements OnInit {

  baseUrl : string;
  loginUrl : string;
  constructor() { }

  ngOnInit() {
    this.baseUrl = "http://localhost:4200/"
    this.loginUrl = this.baseUrl + "login";
  }

}
