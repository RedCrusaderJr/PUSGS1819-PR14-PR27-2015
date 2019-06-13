import { Component, OnInit, NgZone } from '@angular/core';
import { LineService } from '../services/http/line.service';
import { Line } from '../Models/Line';
import { Polyline } from '../Models/polyline';
import { MarkerInfo } from '../Models/marker-info.model';
import { GeoLocation } from '../Models/geolocation';
import { Station } from '../Models/Station';
import { BusLocationsService } from '../services/http/buslocation.service';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-bus-location',
  templateUrl: './bus-location.component.html',
  styleUrls: ['./bus-location.component.css'],
  styles: ['agm-map {height: 400px; width: 800px;}'],
  providers: [LineService, BusLocationsService]
})
export class BusLocationComponent implements OnInit {

  isUrbanSelection: boolean;
  selectedLine: Line;
  allLines: Line[];
  urbanLines: Line[];
  suburbanLines: Line[];
  isConnected: Boolean;

  //#region map
  public polyline: Polyline;
  public markersOnMap: MarkerInfo[] = [];
  public tempStationOnMap: Polyline;
  public stationsOnMap: Polyline[];
  public zoom: number;
  markerInfo: MarkerInfo;
  busIcon: any = { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } };
  selectedBusIcon: any = { url: "assets/selected_busicon.png", scaledSize: { width: 50, height: 50 } };
  //#endregion

  constructor(private ngZone: NgZone, private lineService: LineService, private busLocationService: BusLocationsService) {


  }

  ngOnInit() {
    this.isUrbanSelection = undefined;
    this.selectedLine = this.getDefaultLine();
    this.defaultMapSetup();
    this.updateLines();
    this.checkConnection();
    this.busLocationService.registerForBusAdded();
    this.busLocationService.registerForBusDeleted();
    this.busLocationService.registerForBusMoved();
    this.subscribeForBusAdded();
    this.subscribeForBusMoved();
    this.subscribeForBusDelete();


  }
  get getLastPointLatitude() :number {
    let point = this.selectedLine.path.split('|')[this.selectedLine.path.split('|').length - 2];
    let ret : number = Number(point.split('-')[0]);
    return ret; 
  }

  get getLastPointLongitude() :number {
    let point = this.selectedLine.path.split('|')[this.selectedLine.path.split('|').length - 2];
    let ret : number = Number(point.split('-')[1]);
    return ret;  
  }

  private checkConnection() {
    this.busLocationService.startConnection().subscribe(e => {
      this.isConnected = e;
      if (e) {
        this.busLocationService.StartTimer();


      }
    });
  }

  private subscribeForBusAdded() {
    this.busLocationService.busAdded.subscribe(e => {
      this.ngZone.run(() => {
        e.forEach(element => {
          let latitude = element.Position.split('-')[0];
          let longitude = element.Position.split('-')[1];
          let location = new GeoLocation(latitude, longitude);
          let marker = new MarkerInfo(location, { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } }, element.AutobusId, "Autobus", "", { busId: element.AutobusId, lineId: element.LineId });
          this.markersOnMap.push(marker);
          console.log(marker);
        });
      })
     
    })
  }

  private subscribeForBusMoved() {
    this.busLocationService.busMoved.subscribe(e => {
      this.ngZone.run(() => {
        e.forEach(element => {
          for (let i = 0; i < this.markersOnMap.length; i++) {
            if (element.AutobusId == this.markersOnMap[i].title) {
              let latitude = element.Position.split('-')[0];
              let longitude = element.Position.split('-')[1];
              this.markersOnMap[i].location.latitude = latitude;
              this.markersOnMap[i].location.longitude = longitude;
            }
          }

        });
      })


    });
  }

  private subscribeForBusDelete() {
    this.busLocationService.busDeleted.subscribe(e => {
      this.ngZone.run(() => {
        e.forEach(element => {
          let length = this.markersOnMap.length;
          let temp = []
          for (let i = 0; i < length; i++) {
            let marker = this.markersOnMap.pop();
            if (marker.title != e.AutobusId) {
              temp.push(marker);
            }
          }
          temp.forEach(s => {
            this.markersOnMap.push(s);
          });
        })
      })
      

    });
  }


  onIsUrbanSelection(isUrbanSelection: boolean) {
    if (this.isUrbanSelection != undefined && this.isUrbanSelection == isUrbanSelection) {
      this.isUrbanSelection = undefined;
      this.selectedLine = this.getDefaultLine();
      this.defaultMapSetup();
      this.updateLines();
    } else {
      this.isUrbanSelection = isUrbanSelection;
      this.updateLines();
    }
  }

  onLineSelection(selection: Line) {
    if (this.selectedLine != undefined && this.selectedLine.orderNumber == selection.orderNumber) {
      this.selectedLine = this.getDefaultLine();;
      this.defaultMapSetup();
    } else {
      this.selectedLine = selection;
    }

    this.drawLine(selection);
  }

  drawLine(line: Line) {
    this.polyline = new Polyline([], 'blue', null);
    if (line != undefined && line != null && line.path != undefined && line.path != null) {
      line.path.split('|').forEach(point => {
        let latitude: number = Number(point.split('-')[0]);
        let longitude: number = Number(point.split('-')[1]);
        this.polyline.addLocation(new GeoLocation(latitude, longitude));
      });

      this.stationsOnMap = [];
      line.stations.forEach(station => {
        this.tempStationOnMap = new Polyline([], 'blue', null);
        this.tempStationOnMap.addLocation(new GeoLocation(station.latitude, station.longitude));

        this.stationsOnMap.push(this.tempStationOnMap);
      });

      this.tempStationOnMap = undefined;
    }
  }

  updateLines() {
    this.allLines = [];
    this.urbanLines = [];
    this.suburbanLines = [];

    this.lineService.getAllLines().subscribe(data => {
      this.allLines = [];
      this.urbanLines = [];
      this.suburbanLines = [];
      if (data != undefined && data != null) {
        data.forEach(line => {
          let lineToPush: Line = {
            isUrban: line.IsUrban,
            orderNumber: line.OrderNumber,
            path: line.Path,
            stations: [],
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

          if (lineToPush.isUrban) {
            this.urbanLines.push(lineToPush);
          }
          else {
            this.suburbanLines.push(lineToPush);
          }

          this.allLines.push(lineToPush)


        });

      }
      //this.lineService.startHub().subscribe(data => console.log("Hub started: " + data), error => console.log(error));
    },
      err => {
        console.log(err)
        this.allLines = [];
        this.urbanLines = [];
        this.suburbanLines = [];
      });

    console.log("All lines:");
    console.log(this.allLines);

    console.log("suburban Lines");
    console.log(this.urbanLines);

    console.log("Suburban Lines");
    console.log(this.suburbanLines);
  }

  defaultMapSetup() {
    this.stationsOnMap = [];
    this.markerInfo = new MarkerInfo(new GeoLocation(45.242268, 19.842954),
      "assets/ftn.png",
      "Jugodrvo", "", "http://ftn.uns.ac.rs/691618389/fakultet-tehnickih-nauka");
    this.polyline = new Polyline([], 'blue', null);
    // { url: "assets/busicon.png", scaledSize: { width: 50, height: 50 } }
  }

  onMarkerClick(station) {

  }

  getDefaultLine(): Line {
    return {
      isUrban: true,
      orderNumber: '',
      path: '',
      stations: [],
    };
  }

}
