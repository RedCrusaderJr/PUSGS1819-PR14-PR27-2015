import { Component, OnInit } from '@angular/core';
import { Line } from '../Models/Line';
import { LineService } from '../services/http/line.service';
import { TimetableService } from '../services/http/timetable.service';
import { Timetable } from '../Models/Timetable';
import { TimetableEntry } from '../Models/TimetableEntry';
import { DepartureTableRow } from '../Models/DepartureTableRow';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css' ],
  providers: [ TimetableService, LineService ]
})
export class TimetableComponent implements OnInit {

  daySelection : number;
  
  isUrbanSelection : Boolean 

  urbanLines : Line[];
  suburbanLines : Line[];
  lineSelection : Line;
  
  timetables : Timetable[];
  wdTimetableEntries : TimetableEntry[];
  satTimetableEntries : TimetableEntry[];
  sunTimetableEntries : TimetableEntry[];

  filteredDepartures : DepartureTableRow[];

  BreakException = {
    message: "forEach break"
  };

  constructor(protected timetableService: TimetableService, protected lineService: LineService) { }

  ngOnInit() {
    this.daySelection = undefined;
    this.isUrbanSelection = true;
    this.urbanLines = [];
    this.suburbanLines = [];

    this.timetables = [];
    this.timetables.push(null);
    this.timetables.push(null);

    this.wdTimetableEntries = [];
    this.satTimetableEntries = [];
    this.sunTimetableEntries = [];
    
    this.filteredDepartures = [];
    this.filteredDepartures.push(this.getDefaultRow());
    
    try {
      this.initTimetables();
    } catch(e) {
      if(e != this.BreakException) {
        console.log(e);
        throw e;
      }
      console.log("BREAK EXCEPTION:" + e.message)
    }
  }

  initTimetables() {
    this.timetableService.getAllTimetables().subscribe(data => {
      data.forEach(timetable => {

        if(timetable.isUrban)
        {
          this.timetables[0] = timetable;
        } else {
          this.timetables[1] = timetable;
        }
        
        if(timetable.timetableEntries == undefined || timetable.timetableEntries == null) {
          throw this.BreakException;
        }

        timetable.timetableEntries.forEach(timetableEntry => {
          if(timetableEntry.day == 0) {
            this.wdTimetableEntries.push(timetableEntry);
          } 
          else if(timetableEntry.day == 1) {
            this.satTimetableEntries.push(timetableEntry);
          }
          else if(timetableEntry.day == 2) {
            this.sunTimetableEntries.push(timetableEntry);
          }
    
          if((timetableEntry.lineId != "" && 
              timetableEntry.lineId != null &&
              timetableEntry.lineId != undefined) &&
             (timetableEntry.line == undefined || timetableEntry.line == null)) {
              this.lineService.getLineById(timetableEntry.lineId).subscribe(data => {
                if(data.isUrban) {
                  this.urbanLines.push(data);
                } else {
                  this.suburbanLines.push(data);
                }
              }, err => console.log(err));
          }
          else if((timetableEntry.lineId != "" && 
                   timetableEntry.lineId != null &&
                   timetableEntry.lineId != undefined)) {
            if(timetableEntry.line.isUrban) {
              this.urbanLines.push(timetableEntry.line);
            } else {
              this.suburbanLines.push(timetableEntry.line);
            }
          }
        })
      });  
    } , err => console.log(err));
  }

  getDefaultRow() : DepartureTableRow {
    let newRow = {
      weekday   : '',
      sathurday : '',
      sunday    : '',     
    }
    return newRow;
  }
    

  onIsUrbanSelection(isUrbanSelection : boolean) {
    if(this.isUrbanSelection != undefined && this.isUrbanSelection  == isUrbanSelection) {
      this.isUrbanSelection = undefined;
    } else {
      this.isUrbanSelection = isUrbanSelection;
    }
  }

  onLineSelection(selection : Line) {
    if(this.lineSelection != undefined && this.lineSelection.orderNumber  == selection.orderNumber) {
      this.lineSelection = undefined;
    } else {
      this.lineSelection = selection;
    }
    
    this.filterDepartures();
  }

  onDaySelection(daySelection : number) {
    if(this.daySelection != undefined && this.daySelection == daySelection) {
      this.daySelection = undefined;
    } else {
      this.daySelection = daySelection;
    }
  }

  filterDepartures() {
    let wdDepartures : string[] = [];
    let satDepartures : string[] = [];
    let sunDepartures : string[] = [];

    this.wdTimetableEntries.forEach(entry => {
      if(entry.lineId == this.lineSelection.orderNumber) {
        wdDepartures = this.parseDepartures(entry.timeOfDeparture);
      }
    });

    this.satTimetableEntries.forEach(entry => {
      if(entry.lineId == this.lineSelection.orderNumber) {
        satDepartures = this.parseDepartures(entry.timeOfDeparture);
      }
    });

    this.sunTimetableEntries.forEach(entry => {
      if(entry.lineId == this.lineSelection.orderNumber) {
        sunDepartures = this.parseDepartures(entry.timeOfDeparture);
      }
    });

    let maxLength : number = wdDepartures.length;
    if(satDepartures.length > maxLength)
    {
      maxLength = satDepartures.length;
    }
    if(sunDepartures.length > maxLength)
    {
      maxLength = sunDepartures.length;
    }
    
    for (let i = 0; i < maxLength; i++) {
      let departureRow : DepartureTableRow;
      departureRow.weekday    = '';
      departureRow.sathurday  = '';
      departureRow.sunday     = '';
      
      if(wdDepartures[i] != null && wdDepartures[i] != undefined)
      {
        departureRow.weekday = wdDepartures[i];
      }

      if(satDepartures[i] != null && satDepartures[i] != undefined)
      {
        departureRow.sathurday = satDepartures[i];
      }
      
      if(sunDepartures[i] != null && sunDepartures[i] != undefined)
      {
        departureRow.sunday = sunDepartures[i];
      }

      this.filteredDepartures[this.filterDepartures.length-1] = departureRow;
      this.filteredDepartures.push(this.getDefaultRow());
    }
  }

  parseDepartures(departuresString : string) {
    return departuresString.split(',');
  }
}
