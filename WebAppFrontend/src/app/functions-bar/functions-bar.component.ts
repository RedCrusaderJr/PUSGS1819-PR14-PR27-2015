import { Component, OnInit } from '@angular/core';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-functions-bar',
  templateUrl: './functions-bar.component.html',
  styleUrls: ['./functions-bar.component.css'],
  providers: [JwtService]
})
export class FunctionsBarComponent implements OnInit {

  constructor(private jwtService: JwtService) { }

  ngOnInit() {
  }

}
