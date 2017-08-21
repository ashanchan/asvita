import { Injectable } from '@angular/core';

@Injectable()

export class DataService {
  private isAuthenticated: boolean = false;
  private jwtToken: string = '';
  private userId: string = '';
  private profileData: any;
  private diskSpace: any = '0';
  private folderPath: string;
  private rootPath: string;
  private subscription: any;
  private searchList: any;
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
    this.folderPath = val;
  }
  //=======================================
  //=======================================
  public getFolderPath(): any {
    return this.folderPath;
  }
  //=======================================
  //=======================================
  public setRootPath(val): void {
    this.rootPath = val;
  }
  //=======================================
  //=======================================
  public getRootPath(): any {
    return this.rootPath;
  }

  //=======================================
  //=======================================
  public setSubscription(val): any {
    this.subscription = val;
  }
  //=======================================
  //=======================================
  public getSubscription(): any {
    return this.subscription;
  }
  //=======================================
  //=======================================
  public setSearchList(val): any {
    this.searchList = val;
  }
  //=======================================
  //=======================================
  public getSearchList(): any {
    return this.searchList;
  }
  //=======================================
  //=======================================
  public getConvertedDate(val): any {
    return String(new Date(val)).substr(4, 12);
  }
  //=======================================
  //=======================================
  public getRandomExt(): any {
    return Math.random();
  }
}
