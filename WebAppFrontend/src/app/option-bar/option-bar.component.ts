import { Component, OnInit, Input } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { AccountService } from '../services/http/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-option-bar',
  templateUrl: './option-bar.component.html',
  styleUrls: ['./option-bar.component.css'],
  providers: [JwtService, AccountService]
})
export class OptionBarComponent implements OnInit {

  baseUrl : string;

  @Input() isLogged : boolean;
  constructor(private jwtService: JwtService, private accountService: AccountService, private router: Router) { }

  ngOnInit() {
    this.baseUrl = "http://localhost:4200/"
  }

  onLogout() {
    this.accountService.logout().subscribe(
      data => {
        localStorage.setItem('jwt', undefined);
        this.router.navigate(['']); //umesto ovoga navigacija na neki homepage

      },
      err => {
        console.log(err);
      }
    ); 
  }

}
