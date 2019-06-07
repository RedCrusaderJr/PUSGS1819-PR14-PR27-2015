
import { CanActivateChild, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { JwtService } from '../services/jwt.service';

@Injectable({
    providedIn: 'root',
  })
export class ControllerGuard implements CanActivate, CanActivateChild {
    constructor(private router: Router, private jwtService: JwtService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(this.jwtService.getRole() == "Controller"){
            return true;
        }
        else {
            console.error("Can't access, not controller.");
            this.router.navigate(['']);
            return false;
        }
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
        return this.canActivate(route, state);
    }
    

}