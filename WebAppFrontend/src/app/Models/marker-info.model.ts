import { GeoLocation } from "./geolocation";

export class MarkerInfo {
    iconUrl: any;
    title: string;
    label: string;
    location: GeoLocation;
    link: string;
    busId : number;
    lineId : string;

    constructor(location: GeoLocation, icon: any, title:string, label:string, link: string, optional? : any){
        this.iconUrl = icon;
        this.title = title;
        this.label = label;
        this.location = location;
        this.link = link;
        if (optional != undefined || optional != null ){
            this.busId = optional.busId;
            this.lineId = optional.lineId;
        }
    }
} 