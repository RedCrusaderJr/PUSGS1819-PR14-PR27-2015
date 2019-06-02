import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {
    geIsLoggedIn() : boolean {
        // console.log(localStorage.getItem('jwt'));
        // console.log(localStorage.getItem('jwt') != "undefined" && localStorage.getItem('jwt') != null && localStorage.getItem('jwt') != "")
        return localStorage.getItem('jwt') != "undefined" && localStorage.getItem('jwt') != null && localStorage.getItem('jwt') != "";
    }

    getRole() : string {
        let jwt = localStorage.getItem('jwt');

        if (jwt != "undefined" && jwt != null && jwt != ""){
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