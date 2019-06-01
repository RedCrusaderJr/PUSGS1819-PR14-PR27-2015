import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {
    geIsLoggedIn() : boolean {
        return localStorage.getItem('jwt') != "undefined";
    }

    getRole() : string {
        let jwt = localStorage.getItem('jwt');

        if (jwt != undefined){
            let jwtData = jwt.split('.')[1];
            let decodedJwtJsonData = window.atob(jwtData);
            let decodedJwtData = JSON.parse(decodedJwtJsonData);
                
      return decodedJwtData.role;
        }
        else {
            return undefined;
        }
    }
}