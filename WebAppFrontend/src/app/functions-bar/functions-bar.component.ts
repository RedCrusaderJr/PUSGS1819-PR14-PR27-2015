import { Component, OnInit } from '@angular/core';
import { JwtService } from '../services/jwt.service';

@Component({
  selector: 'app-functions-bar',
  templateUrl: './functions-bar.component.html',
  styleUrls: ['./functions-bar.component.css'],
  providers: [JwtService]
})
export class FunctionsBarComponent implements OnInit {

  functionSelection : number; 

  constructor(private jwtService: JwtService) { }

  ngOnInit() {
  }

  selectFunction(selection: number) {
    if(this.functionSelection != undefined && this.functionSelection == selection) {
      this.functionSelection = undefined;

    } else {
      this.functionSelection = selection;
    }
  }
}
