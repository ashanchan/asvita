import { Injectable } from '@angular/core';

@Injectable()

export class DataService {
  private isAuthenticated: boolean = false;
  private jwtToken: string = '';
  private userId: string = '';
  private profileData: any;
  private diskSpace: any;
  private folerPath: string;
  //=======================================
  //=======================================
  public setToken(token): void {
    this.jwtToken = token;
    this.isAuthenticated = true;
  }
  //=======================================
  //=======================================
  public getToken(): any {
    return this.jwtToken;
  }
  //=======================================
  //=======================================
  public setUserId(id: string): void {
    this.userId = id;
  }
  //=======================================
  //=======================================
  public getUserId(): string {
    return this.userId;
  }
  //=======================================
  //=======================================
  public setProfileData(val): void {
    this.profileData = val;
  }
  //=======================================
  //=======================================
  public getProfileData(): any {
    return this.profileData;
  }
  //=======================================
  //=======================================
  public setDiskSpace(val): void {
    this.diskSpace = val;
  }
  //=======================================
  //=======================================
  public getDiskSpace(): any {
    return this.diskSpace;
  }
  //=======================================
  //=======================================
  public setFolderPath(val): void {
    this.folerPath = val;
  }
  //=======================================
  //=======================================
  public getFolderPath(): any {
    return this.folerPath;
  }
}
