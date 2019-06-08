import { Component, OnInit } from '@angular/core';
import { TimetableComponent } from '../timetable/timetable.component';
import { TimetableService } from '../services/http/timetable.service';
import { LineService } from '../services/http/line.service';
import { Line } from '../Models/Line';
import { SelectedDeparture } from '../Models/SelectedDeparture';
import { DepartureTableRow } from '../Models/DepartureTableRow';

@Component({
  selector: 'app-timetable-editor',
  templateUrl: './timetable-editor.component.html',
  styleUrls: ['./timetable-editor.component.css' ],
  providers: [ TimetableService, LineService ]
})
export class TimetableEditorComponent extends TimetableComponent implements OnInit {

  constructor(timetableService: TimetableService, lineService: LineService ) {
    super(timetableService, lineService);
  }

  selectedDeparture : SelectedDeparture;

  ngOnInit() {
    super.ngOnInit();
  }

  onDepartureSelection(lineSelection : Line, daySelection : number, index : number, selectedDeparture : string) {
    this.selectedDeparture.lineSelection = lineSelection;
    this.selectedDeparture.daySelection = daySelection;
    this.selectedDeparture.index = index;
    this.selectedDeparture.departureEntry = selectedDeparture;
  }

  onSave() {
    let success : boolean = true;
    try {
      success = this.saveFunction();
    } catch(e) {
      success = false;
      if(e != this.BreakException) {
        console.log(e);
        throw e;
      } else {
        console.log("BREAK EXCEPTION:" + e.message);
      }
    }

    this.finalizeSave(success);
  }

  saveFunction() : boolean{
    let timetableIndex : number;
    if(this.isUrbanSelection)
    {
      timetableIndex = 0;
    }
    else
    {
      timetableIndex = 1;
    }

    if(this.timetables == undefined || this.timetables == null) {
      return false;
    }

    if(this.timetables[timetableIndex] == undefined || this.timetables[timetableIndex] == null) {
      return false;
    }

    if(this.timetables[timetableIndex].timetableEntries == undefined || this.timetables[timetableIndex].timetableEntries == null) {
      return false;
    }

    this.timetables[timetableIndex].timetableEntries.forEach(entry => {
      if(entry.lineId == this.lineSelection.orderNumber) {
        if(this.daySelection == undefined || this.daySelection == null) {
            //za svaki od najvise 3 entrija po liniji
            entry.timeOfDeparture = this.formatDeparturesToString(this.filteredDepartures, entry.day);

        } else if(this.daySelection != undefined && this.daySelection != null && this.daySelection == entry.day) {
          //samo za entri ciji je se dan poklapa sa selektovanim
          entry.timeOfDeparture = this.formatDeparturesToString(this.filteredDepartures, entry.day);
        }
        throw this.BreakException;
      }
    });

    this.timetableService.putTimetable(this.timetables[timetableIndex].isUrban, this.timetables[timetableIndex]);
    return true;
  }

  formatDeparturesToString(departures: DepartureTableRow[], day: number) : string {
    let stringOfDepartures : string = "";
    departures.forEach(departure => {
      if(day == 0) {
        if(this.validateDepartureFormat(departure.weekday)) {
          stringOfDepartures += departure.weekday + ',';
        } else {
          stringOfDepartures += ',';
        }
      } else if(day == 1) {
        if(this.validateDepartureFormat(departure.sathurday))
        {
          stringOfDepartures += departure.sathurday + ',';
        } else {
          stringOfDepartures += ',';
        }
      } else if(day == 2) {
        if(this.validateDepartureFormat(departure.sunday)) {
          stringOfDepartures += departure.sunday + ',';
        } else {
          stringOfDepartures += ',';
        }
      }
    });

    stringOfDepartures.substring(0, stringOfDepartures.length - 1);
    return stringOfDepartures;
  }

  validateDepartureFormat(departure: string) : boolean {
    let departureFormat = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
    return departureFormat.test(departure);
  }

  finalizeSave(success : boolean) {
    if(this.filteredDepartures.length > 0)
    {
      let lastDeparture = this.filteredDepartures.pop();
      if(lastDeparture.weekday === '' && lastDeparture.sathurday === '' && lastDeparture.sunday === '') {
        this.finalizeSave(success);
        this.filteredDepartures.push(lastDeparture);

      } else if (success) {
          this.filteredDepartures.push(lastDeparture);
          this.filteredDepartures.push(this.getDefaultRow());

      } else {
          this.filteredDepartures.push(this.getDefaultRow());
      }
    }
  }

}

