import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  private isAuthenticated: boolean = false;
  private isDataLoaded: boolean = false;
  private sectionData: object = {};
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

  setAuthentication(val:boolean) {
    this.isAuthenticated = val;
  }
  hasAuthenticated() {
    return this.isAuthenticated;
  }

}
