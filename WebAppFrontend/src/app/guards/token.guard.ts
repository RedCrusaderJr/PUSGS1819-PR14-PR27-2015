
import { CanActivateChild, CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { JwtService } from '../services/jwt.service';

@Injectable({
    providedIn: 'root',
  })

export class TokenGuard implements CanActivate, CanActivateChild {
    constructor (private router: Router, private jwtService: JwtService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(this.jwtService.isTokenExpired()){
            console.error("Can't access, token expired.");
            localStorage.jwt = undefined;
            return false;
            
        }
        else {
            return true;
        }
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
        return this.canActivate(route, state);
    }
    
}