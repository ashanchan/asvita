import { Injectable } from '@angular/core';

@Injectable()

export class DataService {
  private isAuthenticated: boolean = false;
  private jwtToken: string = '';
  private userId: string = '';
  private profileData: any;
  private diskSpace: any;
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
  public setProfileData(data): void {
    this.profileData = data;
  }
  //=======================================
  //=======================================
  public getProfileData(): any {
    return this.profileData;
  }
  //=======================================
  //=======================================
  public setDiskSpace(data): void {
    this.diskSpace = data;
  }
  //=======================================
  //=======================================
  public getDiskSpace(): any {
    return this.diskSpace;
  }
}
