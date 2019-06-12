import { Component, OnInit, AfterViewInit } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-functions-bar',
  templateUrl: './functions-bar.component.html',
  styleUrls: ['./functions-bar.component.css'],
  providers: [JwtService]
})
export class FunctionsBarComponent implements OnInit {

  functionSelection : number; 

  constructor(private jwtService: JwtService, public router: Router) { }

  ngOnInit() {
  }

  selectFunction(selection: number) {
    // console.log("ROUTER" + this.router.url);
    // console.log(this.router);
    // if(this.functionSelection != undefined && this.functionSelection == selection) {
    //   this.functionSelection = undefined;
    // } else {
      this.functionSelection = selection;
    // }
  }

  // onLoad() {
  //   console.log("OnLoad" + this.router.url);
  //   console.log(this.router);
  //   switch(this.router.routerState.snapshot.url) {
  //     case "/timetable":
  //       this.functionSelection = 0;
  //       break;
     
  //     case "/timetable-editor":
  //       this.functionSelection = 1;
  //       break;
      
  //     case "/bus-lines":
  //       this.functionSelection = 2;
  //       break;
      
  //     case "/map-builder":
  //       this.functionSelection = 3;
  //       break;
      
  //     case "/tickets":
  //       this.functionSelection = 4;
  //       break;
      
  //     case "/ticket-validator":
  //       this.functionSelection = 5;
  //       break;
      
  //     case "/bus-location":
  //       this.functionSelection = 6;
  //       break;
      
  //     case "/validate-users":
  //       this.functionSelection = 7;
  //       break;
      
  //     default:
  //       this.functionSelection = undefined;
  //       break;
  //   }
  // }
}
