import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { DataService } from './../services/data.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private dataService: DataService) { }

  canActivate() {
    console.log('this.dataService.isAuthenticated ', this.dataService.isAuthenticated);
    if (this.dataService.isAuthenticated) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}