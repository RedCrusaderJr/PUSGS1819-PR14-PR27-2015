import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthHttpService {
    base_url = "http://localhost:52295"
    constructor(private http: HttpClient){

    }

    logIn(username: string, password: string) : Observable<any> {
        let data = `username=${username}&password=${password}&grant_type=password`;
        let httpOptions = {
            headers: {
                "Content-type":"application/x-www-form-urlencoded"
            }
        }

        return this.http.post<any>(this.base_url + "/oauth/token", data, httpOptions);
    }
}