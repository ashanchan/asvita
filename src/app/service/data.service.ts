import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  private isAuthenticated: boolean = false;
  private isDataLoaded: boolean = false;
  private sectionData: object = {};
  private jwtToken: string = '';
  constructor() { }

  setSectionData(data: object) {
    this.sectionData = data['module'];
    this.isDataLoaded = true;
  }

  getSectionData(Id: string) {
    return this.sectionData[Id][0]
  }

  hasDataLoaded() {
    return this.isDataLoaded;
  }

  setToken(token) {
    this.jwtToken = token;
    this.isAuthenticated = true;
  }

  getToken() {
    return this.jwtToken;
  }

  setAuthentication(val: boolean) {
    this.isAuthenticated = val;
  }

  hasAuthenticated() {
    return this.isAuthenticated;
  }

}
