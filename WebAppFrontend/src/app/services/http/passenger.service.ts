import { BaseHttpService } from './base.service';
import { Passenger } from 'src/app/Models/Passenger';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

export class PassengerService extends BaseHttpService<any> {
    
    getPassenger(id : string) : Observable<any> {
        this.specificUrl = "/api/Passengers";
        return super.getById(id);
    }

    update(data: any, id: string, options?: any) : Observable<any> {
        this.specificUrl = "/api/Passengers/" + id;
        return this.put(data, options);
    }

    downloadImage(id : string) : Observable<any> {
        this.specificUrl = "/api/Passengers/DownloadPicture";
        let headers = new HttpHeaders({'Content-Type' : 'application/json'});
        return this.http.get(this.baseUrl + this.specificUrl + "/" + id);
    }
} 
