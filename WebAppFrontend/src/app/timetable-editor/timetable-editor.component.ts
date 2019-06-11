import { Component, OnInit } from '@angular/core';
import { TimetableComponent } from '../timetable/timetable.component';
import { TimetableService } from '../services/http/timetable.service';
import { LineService } from '../services/http/line.service';
import { Line } from '../Models/Line';
import { SelectedDeparture } from '../Models/SelectedDeparture';
import { DepartureTableRow } from '../Models/DepartureTableRow';
import { TimetableEntryService } from '../services/http/timetableEntry.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-timetable-editor',
  templateUrl: './timetable-editor.component.html',
  styleUrls: ['./timetable-editor.component.css' ],
  providers: [ TimetableService, LineService, TimetableEntryService ]
})
export class TimetableEditorComponent implements OnInit {

  constructor(private timetableService: TimetableService, private lineService: LineService, private timetableEntryService : TimetableEntryService, private fb : FormBuilder ) {
    
  }

  //selectedDeparture : SelectedDeparture;

  timeTableUrbanMap = {};
  timeTableSuburbanMap = {};

  formReady = false;
  urbanLines = [];
  suburbanLines = [];

  departuresForm;

  linesToShow = [];
  selectedLine = null;

  selectedLineType = "";

  selectedDayType : number;

  departuresToShow = [];

  ngOnInit() {
    this.timeTableUrbanMap = {};
    this.timeTableSuburbanMap = {};
    this.departuresForm = this.fb.group({
      departures : this.fb.array([])
    });
    this.linesToShow = [];
    this.formReady = false;
    this.urbanLines = [];
    this.suburbanLines = [];
    this.selectedLineType = "";
    this.selectedDayType = undefined;
    this.departuresToShow = [];
    this.selectedLine = null;
    this.clearDeparturesFromForm();

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

  get getDepartures() {
    return this.departuresForm.get('departures') as FormArray;
  }

  lineTypeChanged() {
    this.formReady = false;
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
    this.formReady = false;
    this.selectedLine = line;
   
  }

  clearDeparturesFromForm() {
    while(this.getDepartures.length > 0){
      this.getDepartures.removeAt(0);
    }

    
  }

  onChangeDayType() {

    this.clearDeparturesFromForm();
    if (this.selectedLine != null && this.selectedDayType != undefined) {
      if (this.selectedLine.IsUrban) {
        let selectedTimeTableEntry = this.timeTableUrbanMap[this.selectedLine.OrderNumber + this.selectedDayType];

        if (selectedTimeTableEntry != undefined){
          this.departuresToShow = selectedTimeTableEntry.TimeOfDeparture.split(',');
          for (let i = 0; i < this.departuresToShow.length; i++){
            if (this.departuresToShow[i].split(":")[1] == 0){
              this.departuresToShow[i] += "0";
            }
            this.getDepartures.push(this.fb.group({departure : [this.departuresToShow[i], [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/)]]}));
          }
        }
        else {
          
          this.departuresToShow = [];
          
        }
      }
      else {
        let selectedTimeTableEntry = this.timeTableSuburbanMap[this.selectedLine.OrderNumber + this.selectedDayType];

        if (selectedTimeTableEntry != undefined){
          this.departuresToShow = selectedTimeTableEntry.TimeOfDeparture.split(',');
          for (let i = 0; i < this.departuresToShow.length; i++){
            if (this.departuresToShow[i].split(":")[1] == 0){
              this.departuresToShow[i] += "0";
            }
            this.getDepartures.push(this.fb.group({departure : [this.departuresToShow[i], [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/)]]}));

          }
        }
        else {
          this.departuresToShow = [];
        }
      }
    }
    console.log(this.departuresForm.get('departures').value);
    this.formReady = true;
  }


  addRow()
  {
    this.getDepartures.push(this.fb.group({departure : ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/)]]}));
  }

  removeRow(index : number) {
    this.getDepartures.removeAt(index);
  }

  reset() {
    this.onChangeDayType();
  }

  onSubmitDepartures() {
    let departuresToSend = "";

    for(let i = 0; i < this.getDepartures.length; i++) {
      departuresToSend += this.getDepartures.at(i).get('departure').value;

      if (i < this.getDepartures.length - 1) {
        departuresToSend += ',';
      }
    }

    let dataToSend = {
      Departures: departuresToSend,
      Day : this.selectedDayType,
      LineId : this.selectedLine.OrderNumber
    }

    this.timetableEntryService.putTimetableEntries(dataToSend).subscribe(
      data => {
        this.ngOnInit();
      },
      error => {
        console.log(error);
      }
    );
      
    
  }












  // onDepartureSelection(lineSelection : Line, daySelection : number, index : number, selectedDeparture : string) {
  //   this.selectedDeparture.lineSelection = lineSelection;
  //   this.selectedDeparture.daySelection = daySelection;
  //   this.selectedDeparture.index = index;
  //   this.selectedDeparture.departureEntry = selectedDeparture;
  // }

  // onSave() {
  //   // let success : boolean = true;
  //   // try {
  //   //   success = this.saveFunction();
  //   // } catch(e) {
  //   //   success = false;
  //   //   if(e != this.BreakException) {
  //   //     console.log(e);
  //   //     throw e;
  //   //   } else {
  //   //     console.log("BREAK EXCEPTION:" + e.message);
  //   //   }
  //   // }

  //   //this.finalizeSave(success);
  //   let weekdayDepartures = "";

  //   for(let i = 0; i < this.filteredDepartures.length; i++){

  //     if(this.validateDepartureFormat(this.filteredDepartures[i].weekday)) {
  //       weekdayDepartures += this.filteredDepartures[i].weekday + ',';
  //     } else {
  //       weekdayDepartures += ',';
  //     }
      
  //     if (i != this.filteredDepartures.length - 1) {
  //       weekdayDepartures += ",";
  //     }
  //   }

  //   console.log(this.filteredDepartures);

  //   let saturdayDepartures = "";

  //   for(let i = 0; i < this.filteredDepartures.length; i++){
  //     if(this.validateDepartureFormat(this.filteredDepartures[i].sathurday)) {
  //       saturdayDepartures += this.filteredDepartures[i].sathurday + ',';
  //     } else {
  //       saturdayDepartures += ',';
  //     }

  //     if (i != this.filteredDepartures.length - 1) {
  //       saturdayDepartures += ",";
  //     }
  //   }

  //   let sundayDepartures = "";

  //   for(let i = 0; i < this.filteredDepartures.length; i++){
  //     if(this.validateDepartureFormat(this.filteredDepartures[i].sunday)) {
  //       sundayDepartures += this.filteredDepartures[i].sunday + ',';
  //     } else {
  //       sundayDepartures += ',';
  //     }

  //     if (i != this.filteredDepartures.length - 1) {
  //       sundayDepartures += ",";
  //     }
  //   }


  //   let sendData = {
  //     LineId : this.lineSelection,
  //     WeekdayDepartures : weekdayDepartures,
  //     SaturdayDepartures : saturdayDepartures,
  //     SundayDepartures : sundayDepartures
  //   }

  //   this.timetableEntryService.putTimetableEntries(sendData).subscribe(
  //     data => {
  //       console.log("OK");
  //       this.ngOnInit();
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   )
  // }

  // saveFunction() : boolean{
  //   let timetableIndex : number;
  //   if(this.isUrbanSelection)
  //   {
  //     timetableIndex = 0;
  //   }
  //   else
  //   {
  //     timetableIndex = 1;
  //   }

  //   if(this.timetables == undefined || this.timetables == null) {
  //     return false;
  //   }

  //   if(this.timetables[timetableIndex] == undefined || this.timetables[timetableIndex] == null) {
  //     return false;
  //   }

  //   if(this.timetables[timetableIndex].timetableEntries == undefined || this.timetables[timetableIndex].timetableEntries == null) {
  //     return false;
  //   }

  //   this.timetables[timetableIndex].timetableEntries.forEach(entry => {
  //     if(entry.LineId == this.lineSelection) {
  //       if(this.daySelection == undefined || this.daySelection == null) {
  //           //za svaki od najvise 3 entrija po liniji
  //           entry.TimeOfDeparture = this.formatDeparturesToString(this.filteredDepartures, entry.Day);

  //       } else if(this.daySelection != undefined && this.daySelection != null && this.daySelection == entry.Day) {
  //         //samo za entri ciji je se dan poklapa sa selektovanim
  //         entry.TimeOfDeparture = this.formatDeparturesToString(this.filteredDepartures, entry.Day);
  //       }
  //       throw this.BreakException;
  //     }
  //   });

  //   this.timetableService.putTimetable(this.timetables[timetableIndex].isUrban, this.timetables[timetableIndex]);
  //   return true;
  // }

  // formatDeparturesToString(departures: DepartureTableRow[], day: number) : string {
  //   let stringOfDepartures : string = "";
  //   departures.forEach(departure => {
  //     if(day == 0) {
  //       if(this.validateDepartureFormat(departure.weekday)) {
  //         stringOfDepartures += departure.weekday + ',';
  //       } else {
  //         stringOfDepartures += ',';
  //       }
  //     } else if(day == 1) {
  //       if(this.validateDepartureFormat(departure.sathurday))
  //       {
  //         stringOfDepartures += departure.sathurday + ',';
  //       } else {
  //         stringOfDepartures += ',';
  //       }
  //     } else if(day == 2) {
  //       if(this.validateDepartureFormat(departure.sunday)) {
  //         stringOfDepartures += departure.sunday + ',';
  //       } else {
  //         stringOfDepartures += ',';
  //       }
  //     }
  //   });

  //   stringOfDepartures.substring(0, stringOfDepartures.length - 1);
  //   return stringOfDepartures;
  // }

  // validateDepartureFormat(departure: string) : boolean {
  //   let departureFormat = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
  //   return departureFormat.test(departure);
  // }

  // finalizeSave(success : boolean) {
  //   if(this.filteredDepartures.length > 0)
  //   {
  //     let lastDeparture = this.filteredDepartures.pop();
  //     if(lastDeparture.weekday === '' && lastDeparture.sathurday === '' && lastDeparture.sunday === '') {
  //       this.finalizeSave(success);
  //       this.filteredDepartures.push(lastDeparture);

  //     } else if (success) {
  //         this.filteredDepartures.push(lastDeparture);
  //         this.filteredDepartures.push(this.getDefaultRow());

  //     } else {
  //         this.filteredDepartures.push(this.getDefaultRow());
  //     }
  //   }
  // }

}

