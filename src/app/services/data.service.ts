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
  private userMode: string;
  private userTip: object = {};
  private userConnectionList: any = [];
  private userConnectionReqList: any = [];
  private userSentReqList: any = [];
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
  public setUserMode(): void {
    this.userMode = this.userId.substr(0, 3);
  }

  //=======================================
  //=======================================
  public getUserMode(): string {
    return this.userMode;
  }
  //=======================================
  //=======================================
  public setProfileData(val): void {
    this.profileData = val;
    if (this.userMode === 'DOC') {
      this.userTip['icon'] = '<i class="fa fa-stethoscope fa-fw  w3-text-theme"></i>';
      this.userTip['salutation'] = "Dr."
      this.userTip['iconx'] = '<i class="fa fa-user fa-fw  w3-text-theme"></i>';
      this.userTip['salutationx'] = ""
    }
    else {
      this.userTip['iconx'] = '<i class="fa fa-stethoscope fa-fw w3-text-theme"></i>';
      this.userTip['salutationx'] = "Dr."
      if (this.profileData.gender === 'm') {
        this.userTip['icon'] = '<i class="fa fa-male fa-fw  w3-text-theme"></i>';
        this.userTip['salutation'] = 'Mr.';
      }
      else if (this.profileData.gender === 'f') {
        this.userTip['icon'] = '<i class="fa fa-female fa-fw  w3-text-theme"></i>';
        this.userTip['salutation'] = 'Ms.';
      }
      else {
        this.userTip['icon'] = '';
        this.userTip['salutation'] = '';
      }
    }
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
  public setConnectionList(val): any {
    let profileConnection = this.profileData.connection;
    let profileConnectionReq = this.profileData.connectionReq;
    let totalConnection = val;
    let tCtr = totalConnection.length;
    let path = this.getRootPath();

    this.userConnectionList = [];
    this.userConnectionReqList = [];
    this.userSentReqList = [];

    for (let i = 0; i < tCtr; i++) {
      let uCtr = profileConnection.length;
      for (let j = 0; j < uCtr; j++) {
        if (totalConnection[i].userId == profileConnection[j]) {
          totalConnection[i].thumbnail = path + totalConnection[i].userId + '/profile_thumb.jpg';
          totalConnection[i].address = this.clipText(totalConnection[i].address, 100);
          if (String(val[i].connection).split(this.userId).length > 1) {
            this.userConnectionList.push(totalConnection[i]);
            console.log('you connectted');
          }
          if (String(val[i].connectionReq).split(this.userId).length > 1) {
            this.userSentReqList.push(totalConnection[i])
          }
        }
      }
      //====
      let rCtr = profileConnectionReq.length;
      for (let k = 0; k < rCtr; k++) {
        if (totalConnection[i].userId == profileConnectionReq[k]) {
          totalConnection[i].thumbnail = path + totalConnection[i].userId + '/profile_thumb.jpg';
          totalConnection[i].address = this.clipText(totalConnection[i].address, 100);
          this.userConnectionReqList.push(totalConnection[i]);
        }
      }
    }
  }
  //=======================================
  //=======================================
  public getUserConnectionList(): any {
    return this.userConnectionList;
  }
  //=======================================
  //=======================================
  public getUserConnectionReqList(): any {
    return this.userConnectionReqList;
  }
  //=======================================
  //=======================================
  public getUserSentReqList(): any {
    return this.userSentReqList;
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
  //=======================================
  //=======================================
  public getUserTip(): any {
    return this.userTip;
  }
  //=======================================
  //=======================================
  public fillAnimation(elemId, val): void {
    var elem = document.getElementById(elemId);
    var width = 1;
    var id = setInterval(frame, 20);
    function frame() {
      if (width >= val) {
        clearInterval(id);
      } else {
        width++;
        elem.style.width = width + '%';
      }
    }
  }
  //=======================================
  //=======================================
  public clipText(txt: any, val: number): string {
    if (Array.isArray(txt)) {
      txt = txt[0];
    }

    txt = txt.substr(0, val);
    return txt;
  }
}
