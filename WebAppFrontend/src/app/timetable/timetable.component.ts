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

  // daySelection: number;

  // isUrbanSelection: Boolean

  // urbanLines: string[];
  // suburbanLines: string[];
  // lineSelection: string = undefined;

  // timetables: Timetable[];
  // wdTimetableEntries: TimetableEntry[];
  // satTimetableEntries: TimetableEntry[];
  // sunTimetableEntries: TimetableEntry[];

  // filteredDepartures: DepartureTableRow[];

  // BreakException = {
  //   message: "forEach break"
  // };

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


  

//   initTimetables() {
//     this.timetableService.getAllTimetables().subscribe(data => {
//       console.log(data);
//       data.forEach(timetable => {

//         if (timetable.IsUrban) {
//           this.timetables[0] = timetable;
//         } else {
//           this.timetables[1] = timetable;
//         }

//         if (timetable.TimetableEntries == undefined || timetable.TimetableEntries == null) {
//           throw this.BreakException;
//         }

//         timetable.TimetableEntries.forEach(timetableEntry => {
//           if (timetableEntry.Day == 0) {
//             this.wdTimetableEntries.push(timetableEntry);
            
//           }
//           else if (timetableEntry.Day == 1) {
//             this.satTimetableEntries.push(timetableEntry);
//           }
//           else if (timetableEntry.Day == 2) {
//             this.sunTimetableEntries.push(timetableEntry);
//           }

//           if ((timetableEntry.LineId != "" &&
//             timetableEntry.LineId != null &&
//             timetableEntry.LineId != undefined) &&
//             (timetableEntry.Line == undefined || timetableEntry.Line == null)) {
//             if (timetable.IsUrban) {

//               this.urbanLines.push(timetableEntry.LineId);
//             }
//             else {
//               this.suburbanLines.push(timetableEntry.LineId);
//             }



//           }
//           //Ovo je bukvalno isto??
//           else if ((timetableEntry.LineId != "" &&
//             timetableEntry.LineId != null &&
//             timetableEntry.LineId != undefined)) {
//             if (timetableEntry.Line.IsUrban) {
//               this.urbanLines.push(timetableEntry.LineId);
//             } else {
//               this.suburbanLines.push(timetableEntry.LineId);
//             }
//           }
//         })
//       });
//     }, err => console.log(err));
//   }

//   getDefaultRow(): DepartureTableRow {
//     let newRow = {
//       weekday: '',
//       sathurday: '',
//       sunday: '',
//     }
//     return newRow;
//   }


//   onIsUrbanSelection(isUrbanSelection: boolean) {
//     if (this.isUrbanSelection != undefined && this.isUrbanSelection == isUrbanSelection) {
//       this.isUrbanSelection = undefined;
//     } else {
//       this.isUrbanSelection = isUrbanSelection;
//     }
//   }

//   onLineSelection(selection: string) {
//     console.log(selection);
//     if (this.lineSelection != undefined && this.lineSelection == selection) {
//       this.lineSelection = undefined;
//     } else {
//       this.lineSelection = selection;
//       this.filterDepartures();
//     }
// //mozda filterDepartures napolje
//   }

//   onDaySelection(daySelection: number) {
//     if (this.daySelection != undefined && this.daySelection == daySelection) {
//       this.daySelection = undefined;
//     } else {
//       this.daySelection = daySelection;
//     }
//   }

//   filterDepartures() {
//     let wdDepartures: string[] = [];
//     let satDepartures: string[] = [];
//     let sunDepartures: string[] = [];

//     this.wdTimetableEntries.forEach(entry => {
//       if (entry.LineId == this.lineSelection) {
//         wdDepartures = this.parseDepartures(entry.TimeOfDeparture);
//         console.log(wdDepartures);
//       }
//     });

//     this.satTimetableEntries.forEach(entry => {
//       if (entry.LineId == this.lineSelection) {
//         satDepartures = this.parseDepartures(entry.TimeOfDeparture);
//         console.log(satDepartures);
//       }
//     });

//     this.sunTimetableEntries.forEach(entry => {
//       if (entry.LineId == this.lineSelection) {
//         sunDepartures = this.parseDepartures(entry.TimeOfDeparture);
//         console.log(sunDepartures);
//       }
//     });

//     let maxLength: number = wdDepartures.length;
//     if (satDepartures.length > maxLength) {
//       maxLength = satDepartures.length;
//     }
//     if (sunDepartures.length > maxLength) {
//       maxLength = sunDepartures.length;
//     }

//     for (let i = 0; i < maxLength; i++) {
//       let departureRow: DepartureTableRow = {
//         weekday : "",
//         sathurday : "",
//         sunday : ""
//       };
     

//       if (wdDepartures[i] != null && wdDepartures[i] != undefined) {
//         departureRow.weekday = wdDepartures[i];
//       }

//       if (satDepartures[i] != null && satDepartures[i] != undefined) {
//         departureRow.sathurday = satDepartures[i];
//       }

//       if (sunDepartures[i] != null && sunDepartures[i] != undefined) {
//         departureRow.sunday = sunDepartures[i];
//       }

//       this.filteredDepartures[this.filteredDepartures.length - 1] = departureRow;
//       this.filteredDepartures.push(this.getDefaultRow());
//     }
//   }

//   parseDepartures(departuresString: string) {
//     return departuresString.split(',');
//   }
}
