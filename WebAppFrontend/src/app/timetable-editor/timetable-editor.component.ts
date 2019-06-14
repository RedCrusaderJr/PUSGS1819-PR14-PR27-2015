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
  styleUrls: ['./timetable-editor.component.css'],
  providers: [TimetableService, LineService, TimetableEntryService]
})
export class TimetableEditorComponent implements OnInit {

  constructor(private timetableService: TimetableService, private lineService: LineService, private timetableEntryService: TimetableEntryService, private fb: FormBuilder) {

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

  selectedDayType: number;

  departuresToShow = [];

  ngOnInit() {
    this.timeTableUrbanMap = {};
    this.timeTableSuburbanMap = {};
    this.departuresForm = this.fb.group({
      departures: this.fb.array([])
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
        if (data[0].IsUrban) {
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
    if (this.selectedLineType === "urban") {
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
    while (this.getDepartures.length > 0) {
      this.getDepartures.removeAt(0);
    }


  }

  onChangeDayType() {

    this.clearDeparturesFromForm();
    if (this.selectedLine != null && this.selectedDayType != undefined) {
      if (this.selectedLine.IsUrban) {
        let selectedTimeTableEntry = this.timeTableUrbanMap[this.selectedLine.OrderNumber + this.selectedDayType];

        if (selectedTimeTableEntry != undefined) {
          this.departuresToShow = selectedTimeTableEntry.TimeOfDeparture.split(',');
          for (let i = 0; i < this.departuresToShow.length; i++) {
            if (this.departuresToShow[i].split(":")[1] == 0) {
              this.departuresToShow[i] += "0";
            }
            this.getDepartures.push(this.fb.group({ departure: [this.departuresToShow[i], [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/)]] }));
          }
        }
        else {

          this.departuresToShow = [];

        }
      }
      else {
        let selectedTimeTableEntry = this.timeTableSuburbanMap[this.selectedLine.OrderNumber + this.selectedDayType];

        if (selectedTimeTableEntry != undefined) {
          this.departuresToShow = selectedTimeTableEntry.TimeOfDeparture.split(',');
          for (let i = 0; i < this.departuresToShow.length; i++) {
            if (this.departuresToShow[i].split(":")[1] == 0) {
              this.departuresToShow[i] += "0";
            }
            this.getDepartures.push(this.fb.group({ departure: [this.departuresToShow[i], [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/)]] }));

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


  addRow() {
    this.getDepartures.push(this.fb.group({ departure: ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/)]] }));
  }

  removeRow(index: number) {
    this.getDepartures.removeAt(index);
  }

  reset() {
    this.onChangeDayType();
  }

  onSubmitDepartures() {
    let departuresToSend = "";

    for (let i = 0; i < this.getDepartures.length; i++) {
      departuresToSend += this.getDepartures.at(i).get('departure').value;

      if (i < this.getDepartures.length - 1) {
        departuresToSend += ',';
      }
    }

    let timeTableEntryVersion;
    
    if (this.selectedLineType == "urban") {
      if(this.timeTableUrbanMap[this.selectedLine.OrderNumber + this.selectedDayType] == undefined ){
        timeTableEntryVersion = 0;
      }
      else {
        timeTableEntryVersion = this.timeTableUrbanMap[this.selectedLine.OrderNumber + this.selectedDayType].Version;
      }
      
    }
    else {
      if (this.timeTableSuburbanMap[this.selectedLine.OrderNumber + this.selectedDayType] == undefined ){
        timeTableEntryVersion = 0;
      }
      else {
        timeTableEntryVersion = this.timeTableSuburbanMap[this.selectedLine.OrderNumber + this.selectedDayType].Version;
      }
      
    }

    let dataToSend = {
      Departures: departuresToSend,
      Day: this.selectedDayType,
      LineId: this.selectedLine.OrderNumber,
      TimetableEntryVersion: timeTableEntryVersion,
      LineVersion: this.selectedLine.Version,
    }

    console.log(dataToSend);

    this.timetableEntryService.putTimetableEntries(dataToSend).subscribe(data => {
      this.ngOnInit();
    },
    err => {
      this.errorHandler(err);
    });
  }

  errorHandler(err: any) {
    console.log(err);
    if (err.status != undefined && (err.status == 409 || err.status == 404 || err.status == 400) &&
      err.error.includes("WARNING")) {
      alert(err.error);
      if (!err.error.includes("REFRESH")) {
        //todo: refresh
      }
    }
  }
}