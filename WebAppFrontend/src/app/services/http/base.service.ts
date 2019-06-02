import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BaseHttpService<T>{

    baseUrl = "http://localhost:52295";
    specificUrl="";



    constructor (private http: HttpClient) {

    }

    getAll():Observable<T[]> {
        return this.http.get<T[]>(this.baseUrl + this.specificUrl);
    }

    getById(id:number):Observable<T> {
        return this.http.get<T>(this.baseUrl + this.specificUrl + `/${id}`);
    }

    post(data:any, options?:any): Observable<any> {
        return this.http.post(this.baseUrl + this.specificUrl, data, options);
    }
    

}