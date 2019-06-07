import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BaseHttpService<T>{

    baseUrl = "http://localhost:52295";
    specificUrl="";



    constructor (protected http: HttpClient) {

    }

    getAll():Observable<T[]> {
        return this.http.get<T[]>(this.baseUrl + this.specificUrl);
    }

    getById(id:any, options?:JSON):Observable<T> {
        return this.http.get<T>(this.baseUrl + this.specificUrl + `/${id}`);
    }

    post(data:any, options?:any): Observable<any> {
        return this.http.post(this.baseUrl + this.specificUrl, data, options);
    }

    put(data:any, options?:any) : Observable<any> {
        return this.http.put(this.baseUrl + this.specificUrl, data, options);
    }

    delete(id: any, options?: any) : Observable<any> {
        return this.http.delete(this.baseUrl + this.specificUrl + `/${id}`);
    }

}