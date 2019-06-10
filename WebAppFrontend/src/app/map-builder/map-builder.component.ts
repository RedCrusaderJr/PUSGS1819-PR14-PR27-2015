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
  styles: ['agm-map {height: 500px; width: 800px;}'],
  providers: [LineService]
  // da li NgZone ide u provajdere 
})
export class MapBuilderComponent implements OnInit {

  //#region fields
  
  //#region map
  public polyline: Polyline;
  public tempStationOnMap : Polyline;
  public stationsOnMap: Polyline[];
  public zoom: number;
  markerInfo: MarkerInfo;
  busIcon : any = { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } };
  selectedBusIcon : any = { url: "assets/selected_busicon.png", scaledSize: { width: 50, height: 50 } };
  //#endregion

  //#region lines
  lineActionSelection: number;
  linePathSelected : boolean;
  lines: Line[];
  selectedLine: Line;
  isUrbanSelection: boolean;
  //#endregion

  //#region stations
  selectedStation: Station;
  stationActionSelection: number;
  //#endregion
  
  //#region enablers
  pathModificationEnabled: boolean;
  stationActionEnabled: boolean;
  linePreviewEnabled : boolean;
  lineConfirmEnabled : boolean;
  stationPreviewEnabled : boolean;
  stationConfirmEnabled : boolean;
  modDelEnabled : boolean;
  //#endregion
  //#endregion fields


  constructor(private ngZone: NgZone, private lineService: LineService) { }

  ngOnInit() {
    this.defaultMapSetup();
    this.defaultVariablesState();
    this.defaultEnablersState();
    this.selectedLine = this.getDefaultLine();
    this.selectedStation = undefined;
    this.updateLines();
  }

  //#region maintenance
  updateLines() {
    this.lines = [];
    this.lineService.getAllLines().subscribe(data => {
      console.log(data);
      if(data!=undefined && data!=null) {
        data.forEach(line => {

          let lineToPush: Line = {
            isUrban: line.IsUrban,
            orderNumber: line.OrderNumber,
            path: line.Path,
            stations: [],
          };
  
          console.log(line.Stations);
          if(line.Stations != undefined && line.Stations != null)
          {
            line.Stations.forEach(station => {
              let stationToPush: Station = {
                latitude: station.Latitude,
                longitude: station.Longitude,
                name: station.Name,
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
    this.modDelEnabled = false;
  }

  getDefaultLine() : Line {
    return  {
      isUrban: true,
      orderNumber: '',
      path: '',
      stations: [],
    };
  }

  getDefaultStation() : Station {
    return {
      latitude : 0,
      longitude : 0,
      name : '',
    };
  }
  //#endregion maintenance

  //#region handlers
  onLineActionSelection(actionSelection: number) {
    console.log('new: ' + actionSelection + ', old: ' + this.lineActionSelection);
    if (this.lineActionSelection != undefined && this.lineActionSelection == actionSelection) {
      this.lineActionSelection = undefined;
      this.pathModificationEnabled = false;
      this.stationActionEnabled = false;
      this.linePreviewEnabled = false;
      this.defaultMapSetup();
    } else {
      this.lineActionSelection = actionSelection;

      //add line
      if (this.lineActionSelection == 0) {
        this.stationActionEnabled = true;
        this.pathModificationEnabled = true;
        this.selectedLine = this.getDefaultLine();
        this.linePreviewEnabled = true;
      }
      //select line
      else if (this.lineActionSelection == 1) {
        this.updateLines();
        this.stationActionEnabled = false;
        this.pathModificationEnabled = false;
        this.linePreviewEnabled = false;
      }

      //modify line
      else if (this.lineActionSelection == 2 && this.modDelEnabled) {
        this.stationActionEnabled = true;
        this.pathModificationEnabled = true;
        this.linePreviewEnabled = true;
      }

      //delete line
      else if (this.lineActionSelection == 3 && this.modDelEnabled) {
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
        this.stationPreviewEnabled = false;
        this.tempStationOnMap = undefined;
      } else {
        this.stationActionSelection = actionSelection;
        this.pathModificationEnabled = false;
        this.stationPreviewEnabled = true;
      }
    }
  }

  onIsUrbanSelection(isUrbanSelection: boolean) {
    if (this.isUrbanSelection != isUrbanSelection) {
      this.isUrbanSelection = isUrbanSelection;
    }
  }

  onLineSelection(lineSelection: Line) {
    if (this.selectedLine != undefined && this.selectedLine.orderNumber == lineSelection.orderNumber) {
      this.selectedLine = this.getDefaultLine();
      this.modDelEnabled = false;
      this.linePreviewEnabled = false;
    } else {
      console.log(lineSelection);
      this.selectedLine = lineSelection;
      this.modDelEnabled = true;
      this.linePreviewEnabled = true;
    }
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

              // this.stationsOnMap.forEach(station => {
              //   console.log("Station location: (" + station.path[0].latitude + ', ' + station.path[0].longitude + ")");
              // });
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

  onMarkerClick(station: Station) {
    console.log(station);
    
    this.tempStationOnMap = new Polyline([], 'blue', null);
    this.tempStationOnMap.addLocation(new GeoLocation(station.latitude, station.longitude));

    this.selectedStation = {
      latitude : station.latitude,
      longitude : station.longitude,
      name : station.name,
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
    console.log(this.selectedLine);

    this.lineService.postLine(this.selectedLine).subscribe(data => {
      console.log(data);
      this.updateLines();
    }, err => console.log(err));

    this.defaultMapSetup();
    this.defaultVariablesState();
    this.defaultEnablersState();
    this.selectedLine = this.getDefaultLine();
    this.selectedStation = undefined;

    this.selectedLine = this.getDefaultLine();
    this.linePreviewEnabled = false;
  }
  
  onStationConfirm() {
    console.log(this.selectedStation);
    this.stationsOnMap.push(this.tempStationOnMap);
    this.tempStationOnMap = undefined;
    this.selectedLine.stations.push(this.selectedStation);
    this.selectedStation = this.getDefaultStation();
    this.stationPreviewEnabled = false;
  }
  
  onModifiyLine() {
    
  }
  //#endregion handlers
  
  //#region map gymnastics
  mapLineSelection(lineId: string) {

  }

  addStation(latitude: number, longitude: number) {
    if (this.selectedLine == undefined && this.selectedLine == null && this.selectedLine.path == undefined && this.selectedLine == null) {
      return;
    }

    let isValid : boolean;
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
      else if(index == pathLengt - 1) {
        continue;
      }
      else {
        firstPoint.x = secondPoint.x;
        firstPoint.y = secondPoint.y;

        secondPoint.x = xCoordinate;
        secondPoint.y = yCoordinate;
      
        isValid = this.validateStationPosition(latitude, longitude, firstPoint.x, firstPoint.y, secondPoint.x, secondPoint.y)
      }

      if(isValid) {
        // let stationPosition = new Polyline([], 'blue', { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } });
        // stationPosition.addLocation(new GeoLocation(latitude, longitude));
        // this.stationsOnMap.push(stationPosition);
        // console.log("Station location: (" + latitude + ', ' + longitude + ")");
        console.log("For index: " + index);

        this.tempStationOnMap = new Polyline([], 'blue', { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } });
        this.tempStationOnMap.addLocation(new GeoLocation(latitude, longitude));

        this.selectedStation = {
          latitude : latitude,
          longitude : longitude,
          name : '',
        };
        break;
      }
    }
  }

  //bukvalno ne znam šta ne valja
  validateStationPosition(y: number, x: number, x1: number, y1: number, x2: number, y2: number) : boolean {
    let distance : number = undefined;
    // let pointDistance : number = undefined;
    let isValid : boolean = false;
    
    let tangens = (y2 - y1) / (x2 - x1);

    //uspravna linija
    if(tangens >= Number.POSITIVE_INFINITY || tangens <= Number.NEGATIVE_INFINITY) {
      if(tangens >= Number.POSITIVE_INFINITY) {
        if(y < y1) {
          distance = this.fromPointDistance(x, y, x1, y1);
        }
        else if(y > y2) {
          distance = this.fromPointDistance(x, y, x2, y2);
        }
        else {
          distance = this.lineEquationDistance(x, y , x1 , y1, x2, y2);
        }
      } 
      else if(tangens <= Number.NEGATIVE_INFINITY) {
        if(y > y1) {
          distance = this.fromPointDistance(x, y, x1, y1);
        }
        else if(y < y2) {
          distance = this.fromPointDistance(x, y, x2, y2);
        }
        else {
          distance = this.lineEquationDistance(x, y , x1 , y1, x2, y2);
        }
      }
    }
    //pozitivni nagib
    else if(tangens > 0) {
      if(x < x1 && y < y1) {
        distance = this.fromPointDistance(x, y, x1, y1);
      }
      else if(x > x2 && y > y2) {
        distance = this.fromPointDistance(x, y, x2, y2);
      }
      else {
        distance = this.lineEquationDistance(x, y , x1 , y1, x2, y2);
      }
    }
    //negativni nagib
    else if(tangens < 0) {
      if(x < x1 && y > y1) {
        distance = this.fromPointDistance(x, y, x1, y1);
      }
      else if(x > x2 && y < y2) {
        distance = this.fromPointDistance(x, y, x2, y2);
      }
      else {
        distance = this.lineEquationDistance(x, y , x1 , y1, x2, y2);
      }
    }
    //horizontalna linija
    else if(tangens == 0) {
      if(x < x1) {
        distance = this.fromPointDistance(x, y, x1, y1);
      }
      else if(x > x2) {
        distance = this.fromPointDistance(x, y, x2, y2);
      } 
      else {
        distance = this.lineEquationDistance(x, y , x1 , y1, x2, y2);
      }
    }

    let pointDistance1 = this.fromPointDistance(x,y, x1,y1);
    let pointDistance2 = this.fromPointDistance(x,y, x2,y2);
    let equationDistance = this.lineEquationDistance(x,y, x1,y1, x2,y2);
    
    distance = pointDistance1;
    if(pointDistance2 < distance) {
      distance = pointDistance2;
    }
    
    if(equationDistance < distance) {
      distance = equationDistance;
    }

    isValid = distance <= 0.0003;

    if(isValid) {
      console.log('Distance: ' + distance);
    }

    return isValid;
  }

  fromPointDistance(x : number, y : number, x1 : number, y1 : number) : number {
    let distance = Math.sqrt(Math.pow((x-x1),2) + Math.pow((y-y1),2));
    console.log('fromPointDistance: ' + distance);
    return distance;
  }

  lineEquationDistance(x: number, y: number, x1: number, y1: number, x2: number, y2: number) : number {
    let distance = Math.abs((y - y1) - (((y2 - y1) / (x2 - x1)) * (x - x1)));
    console.log('lineEquationDistance: ' + distance);
    return distance;
  }

  placeMarker(latitude: number, longitude: number) {
    this.polyline.addLocation(new GeoLocation(latitude, longitude));
    // console.log(this.polyline);
  }
  //#endregion map gymnastics
  
  // updateLineConfirmEnabled() {
  //   this.stationConfirmEnabled =  this.selectedLine != undefined && this.selectedLine != null &&
  //                                 this.selectedLine.orderNumber != undefined && this.selectedLine.orderNumber != null && this.selectedLine.orderNumber != "";
  // }
  
  // updateStationConfirmEnabled() {
  //   this.stationConfirmEnabled =  this.selectedStation != undefined && this.selectedStation != null &&
  //                                 this.selectedStation.latitude != undefined && this.selectedStation.latitude != null && 
  //                                 this.selectedStation.longitude != undefined && this.selectedStation.longitude != null && 
  //                                 this.selectedStation.name != undefined && this.selectedStation.name != null && this.selectedStation.name != "";
  // }
}
