import { Component, OnInit } from '@angular/core';
import { Line } from '../Models/Line';
import { LineService } from '../services/http/line.service';
import { TimetableService } from '../services/http/timetable.service';
import { Timetable } from '../Models/Timetable';
import { TimetableEntry } from '../Models/TimetableEntry';
import { DepartureTableRow } from '../Models/DepartureTableRow';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css'],
  providers: [TimetableService, LineService]
})
export class TimetableComponent implements OnInit {

 

  constructor(protected timetableService: TimetableService, protected lineService: LineService) { }


  timeTableUrbanMap = {};
  timeTableSuburbanMap = {};

  urbanLines = [];
  suburbanLines = [];

  departuresForm : FormGroup;

  linesToShow = [];
  selectedLine = null;

  selectedLineType = "";

  selectedDayType : number;

  departuresToShow = [];


  ngOnInit() {
    this.timetableService.getAllTimetables().subscribe(
      data => {
        if(data[0].IsUrban) {
          data[0].TimetableEntries.forEach(element => {
            this.timeTableUrbanMap[element.LineId + element.Day] = element;
          });

          data[1].TimetableEntries.forEach(element => {
            this.timeTableSuburbanMap[element.LineId + element.Day] = element;
          });
        }
        else {
          data[0].TimetableEntries.forEach(element => {
            this.timeTableSuburbanMap[element.LineId + element.Day] = element;
          });

          data[1].TimetableEntries.forEach(element => {
            this.timeTableUrbanMap[element.LineId + element.Day] = element;
          });
        }
        this.lineService.getAllLines().subscribe(
          data => {
            data.forEach(element => {
              if (element.IsUrban) {
                this.urbanLines.push(element);
              }
              else {
                this.suburbanLines.push(element);
              }
            })
            

          },
          error => console.log(error)
        );
        
      }, error => console.log(error)
    );
   
    
  }

  lineTypeChanged() {
    
    this.selectedLine = null;
    this.selectedDayType = undefined;
    this.departuresToShow = [];
    if (this.selectedLineType === "urban"){
      this.linesToShow = this.urbanLines;
    }
    else {
      this.linesToShow = this.suburbanLines;
    }
  }

  onLineSelection(line: any) {
    this.selectedLine = line;
    this.selectedDayType = undefined;
   
  }

  onChangeDayType() {
    if (this.selectedLine != null && this.selectedDayType != undefined) {
      if (this.selectedLine.IsUrban) {
        let selectedTimeTableEntry = this.timeTableUrbanMap[this.selectedLine.OrderNumber + this.selectedDayType];

        if (selectedTimeTableEntry != undefined){
          this.departuresToShow = selectedTimeTableEntry.TimeOfDeparture.split(',');
        }
        else {
          this.departuresToShow = [];
        }
      }
      else {
        let selectedTimeTableEntry = this.timeTableSuburbanMap[this.selectedLine.OrderNumber + this.selectedDayType];

        if (selectedTimeTableEntry != undefined){
          this.departuresToShow = selectedTimeTableEntry.TimeOfDeparture.split(',');
        }
        else {
          this.departuresToShow = [];
        }
      }
    }
  }


  


}
