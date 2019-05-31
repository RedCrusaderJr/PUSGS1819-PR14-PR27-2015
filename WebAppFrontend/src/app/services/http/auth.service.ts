import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthHttpService {
    base_url = "http://localhost:52295"
    constructor(private http: HttpClient){

    }

    logIn(username: string, password: string) {
        let data = `username=${username}&password=${password}&grant_type=password`;
        let httpOptions = {
            headers: {
                "Content-type":"application/x-ww-form-urlencoded"
            }
        }

        this.http.post<any>(this.base_url + "/oauth/token", data, httpOptions).subscribe(
            data => {
                localStorage.jwt = data.access_token;
            },
            error => console.log(error)
        );      
    }

    register() {
        let data;
    
    }
}