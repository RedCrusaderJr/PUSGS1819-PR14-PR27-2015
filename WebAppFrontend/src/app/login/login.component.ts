import { Component, OnInit } from '@angular/core';
import { User } from '../Models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  baseUrl : string 
  constructor() { }

  ngOnInit() {
    this.baseUrl = "http://localhost:4200/"
  }
  
}
