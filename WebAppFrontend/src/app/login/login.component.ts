import { Component, OnInit } from '@angular/core';
import { User } from '../Models/User';
import { AuthHttpService } from '../services/http/auth.service';
import { HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  baseUrl : string 
  constructor(private http: AuthHttpService, private router: Router) { }

  ngOnInit() {
    this.baseUrl = "http://localhost:4200/"
  }

  login(user:User)
  {
      this.http.logIn(user.username, user.password);
       
       
       this.router.navigate(['']); //za sada ovako, treba popraviti
  }
  
}
