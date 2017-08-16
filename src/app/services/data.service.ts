import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  private isAuthenticated: boolean = false;
  private jwtToken: string = '';
  constructor() { }

  setToken(token) {
    this.jwtToken = token;
    this.isAuthenticated = true;
  }

  getToken() {
    return this.jwtToken;
  }

}
