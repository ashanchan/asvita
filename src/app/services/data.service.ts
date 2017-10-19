import { Injectable } from '@angular/core';

@Injectable()

export class DataService {
  public isAuthenticated: boolean = false;
  public jwtToken: string = '';
  public userId: string = '';
  public profileData: any;
  public diskSpace: any = '0';
  public folderPath: string;
  public rootPath: string;
  public subscription: any;
  public searchList: any;
  public userMode: string;
  public userTip: object = {};
  public userConnectionList: any = [];
  public userConnectionReqList: any = [];
  public userSentReqList: any = [];
  public medicineList: Array<string> = [];
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
    if (this.profileData) {
      if (this.userMode === 'DOC') {
        this.userTip['icon'] = '<i class="fa fa-stethoscope fa-fw  w3-text-theme"></i>';
        this.userTip['salutation'] = "Dr."
        this.userTip['iconX'] = '<i class="fa fa-user fa-fw  w3-text-theme"></i>';
        this.userTip['iconY'] = '<i class="fa fa-user fa-fw"></i>';
        this.userTip['salutationx'] = ""
      }
      else {
        this.userTip['iconX'] = '<i class="fa fa-stethoscope fa-fw w3-text-theme"></i>';

        this.userTip['salutationx'] = "Dr."
        if (this.profileData.gender === 'm') {
          this.userTip['icon'] = '<i class="fa fa-male fa-fw w3-text-theme"></i>';
          this.userTip['iconY'] = '<i class="fa fa-male fa-fw"></i>';

          this.userTip['salutation'] = 'Mr.';
        }
        else if (this.profileData.gender === 'f') {
          this.userTip['icon'] = '<i class="fa fa-female fa-fw w3-text-theme"></i>';
          this.userTip['iconY'] = '<i class="fa fa-female fa-fw"></i>';
          this.userTip['salutation'] = 'Ms.';
        }
        else {
          this.userTip['icon'] = '';
          this.userTip['salutation'] = '';
        }
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
  public setMedicineList(val): any {
    this.medicineList = val;
  }
  //=======================================
  //=======================================
  public getMedicineList(): any {
    return this.medicineList;
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

    if (txt !== undefined) {
      txt = txt.substr(0, val);
    }
    else {
      txt = '-';
    }
    return txt;
  }
  //=======================================
  //=======================================
  public getGraphTrivia(graphTitle): string {
    let trivia = '';
    switch (graphTitle) {
      case 'weight':
        trivia = `<h4>Body Mass Index</h4><ul><li><b>Below 18.5</b> : Underweight</li><li><b>18.5 - 24.9</b> : Normal</li><li><b>25 - 29.9</b> : Overweight</li><li><b>30 - 34.9</b> : Obese Class I</li><li><b>35 - 40</b> : Obese Class II</li><li><b>Above 40</b> : Obese Class III</li></ul>`;

        break;
      case 'sugar':
        break;
      case 'bp':
        trivia = `<h4>Blood Pressure Levels</h4><ul><li><b>Normal</b> : systolic: less than 120 mmHg. diastolic: less than 80mmHg</li><li><b>At risk (prehypertension)</b> : systolic: 120–139 mmHg. diastolic: 80–89 mmHg</li><li><b>High</b> : systolic: 140 mmHg or higher. diastolic: 90 mmHg or higher</li></ul>`;
        break;
      case 'temperature':
        trivia = `Not everyone's "normal" body temperature is the same. Yours could be a whole degree different than someone else's. A German doctor in the 19th century set the standard at 98.6 F, but more recent studies say the baseline for most people is closer to 98.2 F.<br><br>For a typical adult, body temperature can be anywhere from 97 F to 99 F. Babies and children have a little higher range: 97.9 F to 100.4 F.<br><br>Your temperature doesn't stay same all day, and it will vary throughout your lifetime, too. Some things that cause your temperature to move around during the day include:<ul><li>How active you are</li><li>What time of day it is</li><li>Your age</li><li>Your sex</li><li>What you've eaten or had to drink</li><li>If you're a woman) where you are in your menstrual cycle</li></ul>`;
        break;
    }
    return trivia;
  }
  //=======================================
  //=======================================
  public titleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })
  }
}

