import { GeoLocation } from "./geolocation";
import { Station } from './Station';

export class Polyline {
    public path: GeoLocation[]
    public color: string
    public icon: any
    public optional?: Station

    constructor(path: GeoLocation[], color: string, icon: any, optional?: Station){
        this.color = color;
        this.path = path;
        this.icon = icon
        if(optional != undefined && optional != null) {
            this.optional = {
              name : optional.name,
              address : optional.address,
              latitude : optional.latitude,
              longitude : optional.longitude,
              lineOrderNumber : optional.lineOrderNumber,
            }
        }
    }

    addLocation(location: GeoLocation){
        this.path.push(location)
    }
}