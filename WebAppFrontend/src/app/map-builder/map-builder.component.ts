import { Component, OnInit, NgZone } from '@angular/core';
import { Polyline } from '../Models/polyline';
import { MarkerInfo } from '../Models/marker-info.model';
import { GeoLocation } from '../Models/geolocation';
import { Line } from '../Models/Line';
import { LineService } from '../services/http/line.service';
import { Station } from '../Models/Station';

@Component({
  selector: 'app-map-builder',
  templateUrl: './map-builder.component.html',
  styleUrls: ['./map-builder.component.css'],
  styles: ['agm-map {height: 700px; width: 1000px;}'],
  providers: [LineService]
  // da li NgZone ide u provajdere 
})
export class MapBuilderComponent implements OnInit {

  isUrbanSelection: boolean;
  markerInfo: MarkerInfo;
  lines: Line[];
  selectedLine: Line;
  selectedStation: Station;
  public polyline: Polyline;
  public stationsOnMap: Polyline[];
  public zoom: number;
  lineActionSelection: number;
  stationActionSelection: number;
  stationActionEnabled: boolean;
  pathModificationEnabled: boolean;

  constructor(private ngZone: NgZone, private lineService: LineService) { }

  ngOnInit() {
    this.stationsOnMap = [];
    this.isUrbanSelection = true;
    this.pathModificationEnabled = true;
    this.lineActionSelection = undefined;
    this.stationActionSelection = undefined;
    this.selectedLine = undefined;
    this.stationActionEnabled = false;
    this.selectedStation = undefined;
    this.lines = [];

    this.initLines();

    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954),
      "assets/ftn.png",
      "Jugodrvo", "", "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");

    this.polyline = new Polyline([], 'blue', null);
    // { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } }
  }

  initLines() {
    this.lineService.getAll().subscribe(data => {
      data.forEach(line => {

        let lineToPush: Line = {
          isUrban: line.isUrban,
          orderNumber: line.orderNumber,
          path: line.path,
          stations: [],
        };

        line.stations.forEach(station => {
          let stationToPush: Station = {
            latitude: station.latitude,
            longitude: station.longitude,
            name: station.name,
          };

          lineToPush.stations.push(stationToPush);
        });

        this.lines.push(lineToPush)
      });
    }, err => console.log(err));
  }

  onLineActionSelection(actionSelection: number) {
    console.log('new: ' + actionSelection + ', old: ' + this.lineActionSelection);
    if (this.lineActionSelection != undefined && this.lineActionSelection == actionSelection) {
      this.lineActionSelection = undefined;
      this.pathModificationEnabled = false;
      this.stationActionEnabled = false;
    } else {
      this.lineActionSelection = actionSelection;

      //add line
      if (this.lineActionSelection == 0) {
        this.stationActionEnabled = true;
        this.pathModificationEnabled = true;
        this.selectedLine = {
          isUrban: true,
          orderNumber: '',
          path: '',
          stations: [],
        }
      }
      //select line
      else if (this.lineActionSelection == 1) {
        this.stationActionEnabled = false;
        this.pathModificationEnabled = false;
      }

      //modify line
      else if (this.lineActionSelection == 2) {
        this.stationActionEnabled = true;
        this.pathModificationEnabled = true;
      }

      //delete line
      else if (this.lineActionSelection == 3) {
        this.stationActionEnabled = false;
        this.pathModificationEnabled = false;
      }
    }
  }

  onLineSelection(lineSelection: Line) {
    if (this.selectedLine != undefined && this.selectedLine.orderNumber == lineSelection.orderNumber) {
      this.selectedLine = undefined;
    } else {
      this.selectedLine = lineSelection;
    }
  }

  onStationActionSelection(actionSelection: number) {
    if (this.stationActionEnabled) {
      if (this.stationActionSelection != undefined && this.stationActionSelection == actionSelection) {
        this.stationActionSelection = undefined;
        this.pathModificationEnabled = true;
      } else {
        this.stationActionSelection = actionSelection;
        this.pathModificationEnabled = false;
      }
    }
  }

  onIsUrbanSelection(isUrbanSelection: boolean) {
    if (this.isUrbanSelection != isUrbanSelection) {
      this.isUrbanSelection = isUrbanSelection;
    }
  }

  onMapClick($event) {
    if (this.lineActionSelection != undefined && this.lineActionSelection != null) {
      if (this.lineActionSelection == 0) {
        //add line
        if (this.pathModificationEnabled) {
          this.placeMarker($event.coords.lat, $event.coords.lng);
          this.selectedLine.path += $event.coords.lat + '-' + $event.coords.lng + '|';
        }
        else {
          if (this.stationActionSelection != undefined && this.stationActionSelection != null) {
            if (this.stationActionSelection == 0) {
              //add station
              this.addStation($event.coords.lat, $event.coords.lng);

              this.stationsOnMap.forEach(station => {
                console.log("Station location: (" + station.path[0].latitude + ', ' + station.path[0].longitude + ")");
              });
              
            }
            else if (this.stationActionSelection == 1) {
              //select station
            }
            else if (this.stationActionSelection == 2) {
              //delete station
            }
          }
        }
      }
      else if (this.lineActionSelection == 1) {
        //select line
      }
      else if (this.lineActionSelection == 2) {
        //modify line
        if (this.pathModificationEnabled) {

        }
        else {
          if (this.stationActionSelection == 0) {
            //add station
          }
          else if (this.stationActionSelection == 1) {
            //select station
          }
          else if (this.stationActionSelection == 2) {
            //delete station
          }
        }
      }
      else if (this.lineActionSelection == 3) {
        //delete line
      }
    }
  }

  mapLineSelection(lineId: string) {

  }

  addStation(latitude: number, longitude: number) {
    if (this.selectedLine == undefined && this.selectedLine == null) {
      return;
    }

    let result = {
      isValid : true,
      distance : 0,
    };
    let firstPoint = {
      x: 0,
      y: 0,
    };
    let secondPoint = {
      x: 0,
      y: 0,
    };

    for (let index = 0; index < this.selectedLine.path.split('|').length; index++) {
      result = null;
      let point = this.selectedLine.path.split('|')[index];

      if (point.split('-').length > 2) {
        return;
      }

      let xCoordinate = Number(point.split('-')[0]);
      let yCoordinate = Number(point.split('-')[1]);

      if (index == 0) {
        firstPoint.x = xCoordinate;
        firstPoint.y = yCoordinate;
        continue;
      }
      else if (index == 1) {
        secondPoint.x = xCoordinate;
        secondPoint.y = yCoordinate;

        result = this.validateStationPosition(latitude, longitude, firstPoint.x, firstPoint.y, secondPoint.x, secondPoint.y)
      }
      else {
        firstPoint.x = secondPoint.x;
        firstPoint.y = secondPoint.y;

        secondPoint.x = xCoordinate;
        secondPoint.y = yCoordinate;
      
        result = this.validateStationPosition(latitude, longitude, firstPoint.x, firstPoint.y, secondPoint.x, secondPoint.y)
      }

      if(result.isValid) {
        let stationPosition = new Polyline([], 'blue', { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } })
        stationPosition.addLocation(new GeoLocation(latitude, longitude));
        this.stationsOnMap.push(stationPosition);
        console.log("Station location: (" + latitude + ', ' + longitude + ")");
        break;
      }
    }
  }

  validateStationPosition(x: number, y: number, x1: number, y1: number, x2: number, y2: number) : {isValid : boolean, distance : number } {
    let functinDistance : number = this.lineEquation(x, y , x1 , y1, x2, y2);
    let functinIsValid : boolean = false;
    
    if(functinDistance < 0) {
      functinIsValid = functinDistance >= -0.0008;
    }
    else {
      functinIsValid = functinDistance <= 0.0008;
    }

    let result = {
      isValid : functinIsValid,
      distance : functinDistance,
    };

    return result;
  }

  lineEquation(x: number, y: number, x1: number, y1: number, x2: number, y2: number) : number {
    return (y - y1) - ((y2 - y1) / (x2 - x1)) * (x - x1);
  }

  placeMarker(latitude: number, longitude: number) {
    this.polyline.addLocation(new GeoLocation(latitude, longitude));
    console.log(this.polyline);
  }

  onAddNewLine() {

  }

  onModifiyLine() {

  }

  onSave() {

  }

}
