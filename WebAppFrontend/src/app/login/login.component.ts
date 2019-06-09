import { Component, OnInit } from '@angular/core';
import { User } from '../Models/User';
import { AuthHttpService } from '../services/http/auth.service';
import { HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  baseUrl: string
  constructor(private http: AuthHttpService, private router: Router) { }

  ngOnInit() {
    this.baseUrl = "http://localhost:4200/"
    if (localStorage.jwt != "undefined" && localStorage.jwt != null) {
      this.router.navigate(['']);
    }
  }

  login(user: User) {
    this.http.logIn(user.username, user.password).subscribe(
      data => {
          localStorage.jwt = data.access_token;
          let retData = data.access_token;
          let jwtData = retData.split('.')[1];
          let decodedJwtJsonData = window.atob(jwtData);
          let decodedJwtData = JSON.parse(decodedJwtJsonData);
          
          let role = decodedJwtData.role;
          this.router.navigate(['']); //za sada ovako, treba popraviti
          
      },
      error => console.log(error)
  );      


   
  }

}
