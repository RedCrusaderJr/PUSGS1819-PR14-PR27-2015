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
  styles: ['agm-map {height: 350px; width: 500px;}'],
  providers: [LineService]
  // da li NgZone ide u provajdere 
})
export class MapBuilderComponent implements OnInit {

  //#region fields

  //#region map
  public polyline: Polyline;
  public tempStationOnMap: Polyline;
  public stationsOnMap: Polyline[];
  public zoom: number;
  markerInfo: MarkerInfo;
  busIcon: any = { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } };
  selectedBusIcon: any = { url: "assets/selected_busicon.png", scaledSize: { width: 50, height: 50 } };
  //#endregion

  //#region lines
  lineActionSelection: number;
  linePathSelected: boolean;
  lines: Line[];
  selectedLine: Line;
  savedLine: Line;
  isUrbanSelection: boolean;
  //#endregion

  //#region stations
  selectedStation: Station;
  stationActionSelection: number;
  //#endregion

  //#region enablers
  pathModificationEnabled: boolean;
  stationActionEnabled: boolean;
  linePreviewEnabled: boolean;
  lineConfirmEnabled: boolean;
  stationPreviewEnabled: boolean;
  stationConfirmEnabled: boolean;
  lineModificationEnabled: boolean;
  modifyLineEnabled: boolean;
  deleteLineEnabled: boolean;
  deleteStationEnabled: boolean;
  //#endregion
  //#endregion fields

  constructor(private ngZone: NgZone, private lineService: LineService) { }

  ngOnInit() {
    this.defaultMapSetup();
    this.defaultVariablesState();
    this.defaultEnablersState();
    this.selectedLine = this.getDefaultLine();
    this.selectedStation = this.getDefaultStation();
    this.updateLines();
  }

  //#region maintenance
  updateLines() {
    this.lines = [];
    this.lineService.getAllLines().subscribe(data => {
      if (data != undefined && data != null) {
        data.forEach(line => {

          let lineToPush: Line = {
            isUrban: line.IsUrban,
            orderNumber: line.OrderNumber,
            path: line.Path,
            stations: [],
            version: line.Version,
          };

          if (line.Stations != undefined && line.Stations != null) {
            line.Stations.forEach(station => {
              let stationToPush: Station = {
                latitude: station.Latitude,
                longitude: station.Longitude,
                name: station.Name,
                address: station.Address,
                lineOrderNumber: station.LineOrderNumber,
              };

              lineToPush.stations.push(stationToPush);
            });
          }

          this.lines.push(lineToPush)
        });
      }
    }, err => console.log(err));
  }

  defaultMapSetup() {
    this.stationsOnMap = [];
    this.tempStationOnMap = undefined;
    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954),
      "assets/ftn.png",
      "Jugodrvo", "", "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");
    this.polyline = new Polyline([], 'blue', null);
    // { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } }
  }

  defaultVariablesState() {
    this.lineActionSelection = undefined;
    this.stationActionSelection = undefined;
    this.linePathSelected = false;
    this.isUrbanSelection = true;
  }

  defaultEnablersState() {
    this.pathModificationEnabled = false;
    this.stationActionEnabled = false;
    this.linePreviewEnabled = false;
    this.lineConfirmEnabled = false;
    this.stationPreviewEnabled = false;
    this.stationConfirmEnabled = false;
    this.modifyLineEnabled = false;
    this.deleteLineEnabled = false;
    this.lineModificationEnabled = false;
    this.deleteStationEnabled = false;
  }

  getDefaultLine(): Line {
    return {
      isUrban: true,
      orderNumber: '',
      path: '',
      stations: [],
      version: 0,
    };
  }

  getDefaultStation(): Station {
    return {
      latitude: 0,
      longitude: 0,
      name: '',
      address: '',
      lineOrderNumber: '',
    };
  }

  get polylineLastIndex() { return this.polyline.path.length - 1; }
  //#endregion maintenance

  //#region handlers
  onLineActionSelection(actionSelection: number) {
    this.defaultMapSetup();
    this.stationPreviewEnabled = false;

    if (this.lineActionSelection != undefined && this.lineActionSelection == actionSelection) {
      // this.defaultMapSetup();
      this.lineActionSelection = undefined;
      this.stationActionSelection = undefined;
      this.pathModificationEnabled = false;
      this.stationActionEnabled = false;
      this.linePreviewEnabled = false;
      this.stationPreviewEnabled = false;
      this.selectedLine = this.getDefaultLine();
    } else {

      //iz modify u ostalo, bez potrvde modifikacije
      // if(this.lineActionSelection == 2) {
      //    this.revertLocalSave()
      // }

      //new action selected
      this.lineActionSelection = actionSelection;
      this.stationActionSelection = undefined;

      //add line
      if (this.lineActionSelection == 0) {
        // this.defaultMapSetup();
        this.stationActionEnabled = true;
        this.pathModificationEnabled = true;
        this.selectedLine = this.getDefaultLine();
        this.linePreviewEnabled = true;
      }
      //select line
      else if (this.lineActionSelection == 1) {
        // this.defaultMapSetup();
        this.selectedLine = this.getDefaultLine();

        this.updateLines();
        this.stationActionEnabled = false;
        this.pathModificationEnabled = false;
        this.linePreviewEnabled = false;
      }

      //modify line
      else if (this.lineActionSelection == 2 && this.modifyLineEnabled) {
        // this.defaultMapSetup();
        //saving line
        this.saveLineLocaly();
        this.selectedLine.path = "";
        this.selectedLine.stations = [];

        this.deleteLineEnabled = false;
        this.lineModificationEnabled = true;
        this.stationActionEnabled = true;
        this.pathModificationEnabled = true;
        this.linePreviewEnabled = true;
      }

      //delete line
      else if (this.lineActionSelection == 3 && this.deleteLineEnabled) {
        // this.defaultMapSetup();
        this.deleteLine(this.selectedLine);
        this.modifyLineEnabled = false;
        this.deleteLineEnabled = false;
        this.stationActionEnabled = false;
        this.pathModificationEnabled = false;
        this.linePreviewEnabled = true;
      }
    }
  }

  onStationActionSelection(actionSelection: number) {
    if (this.stationActionEnabled) {
      if (this.stationActionSelection != undefined && this.stationActionSelection == actionSelection) {
        this.stationActionSelection = undefined;
        this.pathModificationEnabled = true;
        this.tempStationOnMap = undefined;
        this.deleteStationEnabled = false;
        this.stationPreviewEnabled = false;
        this.selectedStation = this.getDefaultStation();
      }
      else {
        this.stationActionSelection = actionSelection;
        this.pathModificationEnabled = false;
        this.stationPreviewEnabled = true;

        //deleting station
        if (actionSelection == 0) {
          this.selectedStation = this.getDefaultStation();
        }
        else if (actionSelection == 2) {
          if (this.selectedStation != undefined && this.selectedStation != null && this.deleteStationEnabled) {
            let length = this.selectedLine.stations.length;
            let temp = []
            for (let i = 0; i < length; i++) {
              let station = this.selectedLine.stations.pop();
              if (station.name != this.selectedStation.name) {
                temp.push(station);
              }
            }
            temp.forEach(s => {
              this.selectedLine.stations.push(s);
            });
          }
          this.stationPreviewEnabled = false;
          this.selectedStation = this.getDefaultStation();
        }
      }
    }
  }

  onIsUrbanSelection(isUrbanSelection: boolean) {
    if (this.lineActionSelection == 0 || this.lineActionSelection == 2) {
      if (this.isUrbanSelection != isUrbanSelection) {
        this.isUrbanSelection = isUrbanSelection;
      }
    }
  }

  onLineSelection(lineSelection: Line) {
    if (this.selectedLine != undefined && this.selectedLine.orderNumber == lineSelection.orderNumber) {
      this.selectedLine = this.getDefaultLine();
      this.modifyLineEnabled = false;
      this.deleteLineEnabled = false;
      this.stationActionEnabled = false;
      this.deleteStationEnabled = false;
      this.linePreviewEnabled = false;
      this.stationsOnMap = [];
      this.stationsOnMap = undefined;
      this.defaultMapSetup();
    }
    else {
      this.selectedLine = lineSelection;
      this.modifyLineEnabled = true;
      this.deleteLineEnabled = true;
      this.linePreviewEnabled = true;
      this.stationActionEnabled = true;

      this.stationsOnMap = [];
      this.drawLine(this.selectedLine);

      this.saveLineLocaly();
    }
  }

  onStationRowClick(station: Station) {
    this.stationActionEnabled = false;



    if (this.tempStationOnMap != undefined) {
      this.stationsOnMap.push(this.tempStationOnMap);
    }

    let optional = {
      name: station.name,
      address: station.address,
      latitude: station.latitude,
      longitude: station.longitude,
      lineOrderNumber: station.lineOrderNumber,
    }
    this.tempStationOnMap = new Polyline([], 'blue', optional);
    this.tempStationOnMap.addLocation(new GeoLocation(station.latitude, station.longitude));

    let length = this.stationsOnMap.length;
    let temp = []
    for (let i = 0; i < length; i++) {
      let tempStation = this.stationsOnMap.pop();
      if (tempStation.optional.name != station.name) {
        temp.push(tempStation);
      }
    }
    temp.forEach(s => {
      this.stationsOnMap.push(s);
    });

    this.deleteStationEnabled = true;
    this.selectedStation = {
      address: station.address,
      latitude: station.latitude,
      longitude: station.longitude,
      lineOrderNumber: station.lineOrderNumber,
      name: station.name,
    }
    this.stationPreviewEnabled = true;
  }

  onMapClick($event) {
    if (this.lineActionSelection != undefined && this.lineActionSelection != null) {
      if (this.lineActionSelection == 0) {
        //add line
        if (this.pathModificationEnabled && this.selectedLine.path != undefined && this.selectedLine.path != null) {
          this.placeMarker($event.coords.lat, $event.coords.lng);
          this.selectedLine.path += $event.coords.lat + '-' + $event.coords.lng + '|';
        }
        else {
          if (this.stationActionSelection != undefined && this.stationActionSelection != null) {
            if (this.stationActionSelection == 0) {
              //add station
              this.stationPreviewEnabled = true;
              this.addStation($event.coords.lat, $event.coords.lng);
            }
          }
        }
      }
      else if (this.lineActionSelection == 1) {
        //select line
        if (this.stationActionSelection == 0) {
          //add station
          this.stationPreviewEnabled = true;
          this.addStation($event.coords.lat, $event.coords.lng);
        }
      }
      else if (this.lineActionSelection == 2) {
        //modify line
        if (this.pathModificationEnabled) {
          this.placeMarker($event.coords.lat, $event.coords.lng);
          this.selectedLine.path += $event.coords.lat + '-' + $event.coords.lng + '|';
        }
        else {
          if (this.stationActionSelection == 0) {
            //add station
            this.stationPreviewEnabled = true;
            this.addStation($event.coords.lat, $event.coords.lng);
          }
        }
      }
    }
  }

  saveLineLocaly() {
    this.savedLine = {
      isUrban: this.selectedLine.isUrban,
      orderNumber: this.selectedLine.orderNumber,
      path: this.selectedLine.path,
      stations: [],
      version: this.selectedLine.version,
    }
    this.selectedLine.stations.forEach(station => {
      let savedStation: Station = {
        name: station.name,
        latitude: station.latitude,
        longitude: station.longitude,
        address: station.address,
        lineOrderNumber: station.lineOrderNumber,
      }
      this.savedLine.stations.push(savedStation);
    });
  }

  revertLocalSave() {
    this.selectedLine = {
      isUrban: this.savedLine.isUrban,
      orderNumber: this.savedLine.orderNumber,
      path: this.savedLine.path,
      stations: [],
      version: this.savedLine.version,
    }
    this.savedLine.stations.forEach(station => {
      let savedStation: Station = {
        name: station.name,
        latitude: station.latitude,
        longitude: station.longitude,
        address: station.address,
        lineOrderNumber: station.lineOrderNumber,
      }
      this.selectedLine.stations.push(savedStation);
    });
  }

  onMarkerClick(station: Station) {
    console.log("Station: ");
    console.log(station);

    this.tempStationOnMap = new Polyline([], 'blue', null);
    this.tempStationOnMap.addLocation(new GeoLocation(station.latitude, station.longitude));

    this.selectedStation = {
      latitude: station.latitude,
      longitude: station.longitude,
      name: station.name,
      address: station.address,
      lineOrderNumber: station.lineOrderNumber,
    };
  }

  onLinePathClick() {
    if (this.selectedLine != null && this.selectedLine != undefined && this.selectedLine.path != undefined && this.selectedLine.path != null) {
      if (this.linePathSelected != undefined && this.linePathSelected) {
        this.linePathSelected = false;
      } else {
        this.linePathSelected = true;
      }
    }
  }

  onLineConfirm() {
    if (this.lineActionSelection == 0) {
      this.selectedLine.stations.forEach(station => {
        if (!station.name.includes(this.selectedLine.orderNumber)) {
          station.name = this.selectedLine.orderNumber + '-' + station.name;
        }
      });
      this.selectedLine.isUrban = this.isUrbanSelection;

      this.postLine(this.selectedLine);
    }
    else if (this.lineActionSelection == 1) {
      //modifying station
      this.selectedLine.stations.forEach(station => {
        if (!station.name.includes(this.selectedLine.orderNumber)) {
          station.name = this.selectedLine.orderNumber + '-' + station.name;
        }
      });

      this.putLine(this.selectedLine);
    }
    else if (this.lineActionSelection == 2) {
      this.selectedLine.stations.forEach(station => {
        if (!station.name.includes(this.selectedLine.orderNumber)) {
          station.name = this.selectedLine.orderNumber + '-' + station.name;
        }
      });

      this.putLine(this.selectedLine);
    }
  }

  postLine(line: Line) {
    this.lineService.postLine(line).subscribe(data => {
      this.updateLines();
      this.finalizeLineConfirm();
    },
    err => {
      this.errorHandler(err);
    });
  }

  putLine(line: Line) {
    this.lineService.putLine(line.orderNumber, line).subscribe(data => {
      this.savedLine = undefined;

      this.updateLines();
      this.finalizeLineConfirm()
    },
    err => {
      this.errorHandler(err)
    });
  }

  deleteLine(line: Line) {
    if (line != undefined && line != null) {
      this.lineService.deleteLine(line.orderNumber).subscribe(data => {
        this.updateLines();

        this.defaultMapSetup();
        this.defaultVariablesState();
        this.defaultEnablersState();

        this.selectedLine = this.getDefaultLine();
        this.selectedStation = this.getDefaultStation();
        this.linePreviewEnabled = false;
      },
      err => {
        this.errorHandler(err)
      });
    }
  }

  errorHandler(err: any) {
    console.log(err);
    if (err.status != undefined && (err.status == 409 || err.status == 404 || err.status == 400) &&
      err.error.includes("WARNING")) {
      alert(err.error);
      if (!err.error.includes("REFRESH")) {
        this.finalizeLineConfirm();
      }
    }
  }

  finalizeLineConfirm() {
    this.defaultMapSetup();
    this.defaultVariablesState();
    this.defaultEnablersState();

    this.selectedLine = this.getDefaultLine();
    this.selectedStation = this.getDefaultStation();
    this.linePreviewEnabled = false;
  }

  onStationConfirm() {
    this.stationActionEnabled = true;

    if (this.selectedStation != undefined && this.selectedStation != null && this.selectedStation.name != "") {
      let stationExists = false;
      this.selectedLine.stations.forEach(station => {
        if (station.name.includes(this.selectedStation.name)) {
          stationExists = true;
          if (station.name == this.selectedStation.name) {
            station.address = this.selectedStation.address;
            station.latitude = this.selectedStation.latitude;
            station.longitude = this.selectedStation.longitude;
          }
        }
      }, err => console.log(err));

      if (!stationExists) {
        this.stationsOnMap.push(this.tempStationOnMap);
        this.selectedLine.stations.push(this.selectedStation);
      }
      else {
        if (this.tempStationOnMap != undefined) {
          this.stationsOnMap.push(this.tempStationOnMap);
          this.tempStationOnMap = undefined;
        }
        else {
          let length = this.stationsOnMap.length;
          let temp = []
          for (let i = 0; i < length; i++) {
            let onMapStation = this.stationsOnMap.pop();
            if (onMapStation.optional.longitude != this.selectedStation.longitude || onMapStation.optional.latitude != this.selectedStation.latitude) {
              temp.push(onMapStation);
            }
          }
          temp.forEach(s => {
            this.stationsOnMap.push(s);
          });
        }
      }

      this.tempStationOnMap = undefined;
      this.selectedStation = this.getDefaultStation();
      this.stationPreviewEnabled = false;
      this.deleteStationEnabled = false;
    }
  }
  //#endregion handlers

  //#region map gymnastics
  drawLine(line: Line) {
    this.polyline = new Polyline([], 'blue', null);
    if (line != undefined && line != null && line.path != undefined && line.path != null) {
      line.path.split('|').forEach(point => {
        let latitude: number = Number(point.split('-')[0]);
        let longitude: number = Number(point.split('-')[1]);
        this.polyline.addLocation(new GeoLocation(latitude, longitude));
      });

      this.stationsOnMap = [];
      this.tempStationOnMap = undefined;

      line.stations.forEach(station => {
        let optional = {
          name: station.name,
          address: station.address,
          latitude: station.latitude,
          longitude: station.longitude,
          lineOrderNumber: station.lineOrderNumber,
        }
        let tempPoint = new Polyline([], 'blue', null, optional);
        tempPoint.addLocation(new GeoLocation(station.latitude, station.longitude));

        this.stationsOnMap.push(tempPoint);
        // this.tempStationOnMap = new Polyline([], 'blue', null);
        // this.tempStationOnMap.addLocation(new GeoLocation(station.latitude, station.longitude));

        // this.stationsOnMap.push(this.tempStationOnMap);
      });
    }
  }

  addStation(latitude: number, longitude: number) {
    if (this.selectedLine == undefined && this.selectedLine == null && this.selectedLine.path == undefined && this.selectedLine == null) {
      return;
    }

    let isValid: boolean;
    let firstPoint = {
      x: 0,
      y: 0,
    };
    let secondPoint = {
      x: 0,
      y: 0,
    };

    let pathLengt = this.selectedLine.path.split('|').length
    for (let index = 0; index < pathLengt; index++) {
      isValid = false;
      let point = this.selectedLine.path.split('|')[index];

      if (point.split('-').length > 2) {
        return;
      }

      let xCoordinate = Number(point.split('-')[1]);
      let yCoordinate = Number(point.split('-')[0]);

      if (index == 0) {
        firstPoint.x = xCoordinate;
        firstPoint.y = yCoordinate;
        continue;
      }
      else if (index == 1) {
        secondPoint.x = xCoordinate;
        secondPoint.y = yCoordinate;

        isValid = this.validateStationPosition(latitude, longitude, firstPoint.x, firstPoint.y, secondPoint.x, secondPoint.y)
      }
      else if (index == pathLengt - 1) {
        continue;
      }
      else {
        firstPoint.x = secondPoint.x;
        firstPoint.y = secondPoint.y;

        secondPoint.x = xCoordinate;
        secondPoint.y = yCoordinate;

        isValid = this.validateStationPosition(latitude, longitude, firstPoint.x, firstPoint.y, secondPoint.x, secondPoint.y)
      }

      if (isValid) {
        this.tempStationOnMap = new Polyline([], 'blue', null);
        this.tempStationOnMap.addLocation(new GeoLocation(latitude, longitude));

        this.selectedStation = {
          latitude: latitude,
          longitude: longitude,
          name: '',
          address: '',
          lineOrderNumber: this.selectedLine.orderNumber,
        };
        break;
      }
    }
  }

  //bukvalno ne znam šta ne valja
  validateStationPosition(y: number, x: number, x1: number, y1: number, x2: number, y2: number): boolean {
    let distance: number = undefined;
    // let pointDistance : number = undefined;
    let isValid: boolean = false;

    let tangens = (y2 - y1) / (x2 - x1);

    //uspravna linija
    if (tangens >= Number.POSITIVE_INFINITY || tangens <= Number.NEGATIVE_INFINITY) {
      if (tangens >= Number.POSITIVE_INFINITY) {
        if (y < y1) {
          distance = this.fromPointDistance(x, y, x1, y1);
        }
        else if (y > y2) {
          distance = this.fromPointDistance(x, y, x2, y2);
        }
        else {
          distance = this.lineEquationDistance(x, y, x1, y1, x2, y2);
        }
      }
      else if (tangens <= Number.NEGATIVE_INFINITY) {
        if (y > y1) {
          distance = this.fromPointDistance(x, y, x1, y1);
        }
        else if (y < y2) {
          distance = this.fromPointDistance(x, y, x2, y2);
        }
        else {
          distance = this.lineEquationDistance(x, y, x1, y1, x2, y2);
        }
      }
    }
    //pozitivni nagib
    else if (tangens > 0) {
      if (x < x1 && y < y1) {
        distance = this.fromPointDistance(x, y, x1, y1);
      }
      else if (x > x2 && y > y2) {
        distance = this.fromPointDistance(x, y, x2, y2);
      }
      else {
        distance = this.lineEquationDistance(x, y, x1, y1, x2, y2);
      }
    }
    //negativni nagib
    else if (tangens < 0) {
      if (x < x1 && y > y1) {
        distance = this.fromPointDistance(x, y, x1, y1);
      }
      else if (x > x2 && y < y2) {
        distance = this.fromPointDistance(x, y, x2, y2);
      }
      else {
        distance = this.lineEquationDistance(x, y, x1, y1, x2, y2);
      }
    }
    //horizontalna linija
    else if (tangens == 0) {
      if (x < x1) {
        distance = this.fromPointDistance(x, y, x1, y1);
      }
      else if (x > x2) {
        distance = this.fromPointDistance(x, y, x2, y2);
      }
      else {
        distance = this.lineEquationDistance(x, y, x1, y1, x2, y2);
      }
    }

    let pointDistance1 = this.fromPointDistance(x, y, x1, y1);
    let pointDistance2 = this.fromPointDistance(x, y, x2, y2);
    let equationDistance = this.lineEquationDistance(x, y, x1, y1, x2, y2);

    distance = pointDistance1;
    if (pointDistance2 < distance) {
      distance = pointDistance2;
    }

    if (equationDistance < distance) {
      distance = equationDistance;
    }

    isValid = distance <= 0.0003;

    if (isValid) {
      console.log('Distance: ' + distance);
    }

    return isValid;
  }

  fromPointDistance(x: number, y: number, x1: number, y1: number): number {
    let distance = Math.sqrt(Math.pow((x - x1), 2) + Math.pow((y - y1), 2));
    console.log('fromPointDistance: ' + distance);
    return distance;
  }

  lineEquationDistance(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number {
    let distance = Math.abs((y - y1) - (((y2 - y1) / (x2 - x1)) * (x - x1)));
    console.log('lineEquationDistance: ' + distance);
    return distance;
  }

  placeMarker(latitude: number, longitude: number) {
    this.polyline.addLocation(new GeoLocation(latitude, longitude));
  }
  //#endregion map gymnastics
}
