import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { HttpService } from './../services/http.service';
import { DataService } from './../services/data.service';
import { Router } from '@angular/router';

const SERVER_PATH: string = 'http://localhost:1616/';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})

export class ManagerComponent implements OnInit, OnDestroy {
  public subscription: Subscription;
  public isAuthenticated: boolean = false;
  public tabs: any = [];
  public isNavOpen: boolean = true;
  public activeUrl: string = '';
  public routerSubscription;
  public modalContent: object = {};
  public alertTip: any = [];
  public profilePic: string = '';
  public imgSpec: object = {};
  public previewImg: string = '';
  public formDisabled: boolean = true;
  public uploadFileMode: string = '';
  public folderList: any;
  public viewImage: boolean = false;
  public viewImageUrl: string = '';
  public file: any;
  //=======================================
  //=======================================
  constructor(private messageService: MessageService, private router: Router, private httpService: HttpService, private dataService: DataService) { }
  //=======================================
  //=======================================
  public ngOnInit(): void {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
    this.routerSubscription = this.router.events.subscribe((val: any) => {
      this.activeUrl = val.url;
      this.isNavOpen = true;
      window.scrollTo(0, 0);
    })
  }
  //=======================================
  //=======================================
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.routerSubscription.unsubscribe();
    setTimeout(() => {
      this.isAuthenticated = false;
    }, 1000);
  }
  //=======================================
  //=======================================
  private createTabs(): void {
    let profile = this.dataService.getUserMode().toLowerCase();
    this.tabs.push({ link: '/dashboard', title: 'Dashboard', icon: 'fa fa-home', style: '' });
    this.tabs.push({ link: '/profile', title: 'Profile', icon: 'fa fa-user', style: '' });
    this.tabs.push({ link: '/record', title: 'Record', icon: 'fa fa-medkit', style: '' });
    this.tabs.push({ link: '/connect', title: 'Connect', icon: 'fa fa-handshake-o', style: '' });
    this.tabs.push({ link: '/logout', title: 'Logout', icon: 'fa fa-window-close-o', style: 'w3-right' });
  }
  //=======================================
  //=======================================
  private onMessageReceived(message: any): void {
    switch (message.event) {
      case 'onLoginSubmit':
        this.submitLoginData(message.data);
        break;

      case 'onAuthenticate':
        this.createTabs();
        this.router.navigate(['./dashboard']);
        this.isAuthenticated = this.dataService.isAuthenticated;
        break;

      case 'onProfileSubmit':
        this.submitProfileData(message.data);
        break;

      case 'onImageloadRequest':
        this.imageUploadRequest(message.data);
        break;

      case 'onFileListxxx':
        this.getFileList(message.data);
        break;

      case 'onGetSearchList':
        this.getSearchList(message.data);
        break;

      case 'onSendMailRequest':
        this.sendMailRequest(message.data);
        break;

      case 'onPrescriptionRequest':
        this.getPresciption(message.data);
        break;

      case 'onPrescriptionSubmit':
        this.submitPrescription(message.data);
        break;

      case 'onShowModal':
        this.showModal(message.data);
        break;

      case 'onShowFolder':
        this.getFileList(message.data);
        break;

      case 'onGetMedicineList':
        this.getMedicineList();
        break;

      case 'onLogout':
        this.ngOnDestroy();
        break;
    }
  }
  //=======================================
  //=======================================
  private submitLoginData(val: any): void {
    this.toggleLoader('show');
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'login', val.model, false).subscribe(
      (response: any) => {
        this.toggleLoader('hide');
        if (val.mode === 'login' && response.success) {
          this.dataService.setToken(response.response.token);
          this.dataService.setUserId(response.response.userId);
          this.dataService.setUserMode();
          this.getProfileData('login');
        }
        else {
          this.messageService.sendMessage({ event: 'onLoginProcessed', isSuccess: response.success, msg: response.response.msg });
        }
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private onSubmitConnection(val: any) {
    //  this.toggleLoader('show');
    val.userId = this.dataService.getUserId();
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'profile/updateProfileConnection', val, true).subscribe(
      (response: any) => {
        this.toggleLoader('hide');
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private submitPrescription(val: any) {
    this.toggleLoader('show');
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'util/addPrescription', val.model, true).subscribe(
      (response: any) => {
        this.toggleLoader('hide');
        this.messageService.sendMessage({ event: 'onPrescriptionSaved', data: response.response.data });
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private getPresciption(val: any) {
    this.toggleLoader('show');
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'util/getPrescription', val.model, true).subscribe(
      (response: any) => {
        this.toggleLoader('hide');
        this.messageService.sendMessage({ event: 'onPrescriptionRecd', data: response.response.data });
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private getMedicineList(): void {
    this.toggleLoader('show');
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'util/getMedicine', null, true).subscribe(
      (response: any) => {
        this.dataService.setMedicineList(response.response.data);
        this.messageService.sendMessage({ event: 'onMedicineListRecd' });
        this.toggleLoader('hide');
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private submitProfileData(val: any): void {
    this.toggleLoader('show');
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'profile', val.model, true).subscribe(
      (response: any) => {
        this.toggleLoader('hide');
        if (response.success && val.model.mode === 'updateProfile') {
          this.getProfileData('profile');
        }
        this.messageService.sendMessage({ event: 'onProfileProcessed', data: response.response, mode: val.model.mode });
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  public submitImageData(): void {
    this.toggleLoader('show');
    this.formDisabled = true;
    if (this.uploadFileMode !== 'profile') {
      let fname = document.getElementById('filetoupload')['value'].toString();
      let lidx = fname.lastIndexOf('\\');
      let cName = fname.substring(lidx + 1, fname.length).split('.')[0];
      this.uploadFileMode += '-' + cName;
    }
    let model = { filePath: this.profilePic, mode: this.uploadFileMode, userId: this.dataService.getUserId() };
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'util/uploadImg', model, true).subscribe(
      (response: any) => {
        this.toggleLoader('hide');
        if (this.uploadFileMode === 'profile') {
          this.messageService.sendMessage({ event: 'onProfileImageUpdate', mode: '', isSuccess: true });
        }
        this.messageService.sendMessage({ event: 'onImageUploaded', data: response.response, mode: this.uploadFileMode });
        this.getDiskUsage('imageUpload');
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private sendMailRequest(val: any): void {
    this.toggleLoader('show');
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'util/sendRequestMail', val, true).subscribe(
      (response: any) => {
        this.toggleLoader('hide');
        if (response.success && val.model.mode === 'profile') {
          this.messageService.sendMessage({ event: 'onProfileImageUpdate', mode: '', isSuccess: true });
        }
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private getProfileData(calledFrom): void {
    this.toggleLoader('show');
    let userId = this.dataService.getUserId();
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'profile', { userId: userId }, true).subscribe(
      (response: any) => {
        this.toggleLoader('hide');
        if (response.response.isSuccess) {
          if (!response.response.data.fullName) {
            response.response.data.fullName = '';
            if (Array.isArray(response.response.data.city)) {
              response.response.data.city[0] = '';
              response.response.data.state[0] = '';
            }
            else {
              response.response.data.city = '';
              response.response.data.state = '';
            }
          }
          this.dataService.setProfileData(response.response.data);
          this.dataService.setRootPath(SERVER_PATH + 'uploads/');
          this.dataService.setFolderPath(SERVER_PATH + 'uploads/' + userId + '/');
          if (calledFrom === 'login') {
            this.getSubsciption('login');
          }
          else {
            this.messageService.sendMessage({ event: 'onProfileUpdate', mode: '', isSuccess: true });
          }
        }
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private getDiskUsage(calledFrom: string): void {
    this.toggleLoader('show');
    let userId = this.dataService.getUserId();
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'util/diskSpace', { userId: userId }, true).subscribe(
      (response: any) => {
        this.toggleLoader('hide');
        if (response.response.isSuccess) {
          this.dataService.setDiskSpace(response.response.diskSpace.usedSize);
        }
        if (calledFrom === 'login') {
          let profData = this.dataService.getProfileData();
          let userId = profData.userId;
          let tmp = profData.connection.concat(profData.connectionReq);
          this.getSearchList({ userId: userId, connection: tmp, reqMode: 'login' });
        }
        else {
          this.messageService.sendMessage({ event: 'onDiskSpaceUpdate', isSuccess: true });
        }
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private getFileList(filter): void {
    console.log('filter kya hai ', filter);
    this.toggleLoader('show');
    let userId = this.dataService.getUserId();
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'util/fileList', { userId: userId }, true).subscribe(
      (response: any) => {
        this.toggleLoader('hide');
        if (response.response.isSuccess) {
          this.folderList = this.filterFile(response.response.fileList, filter)
          this.showFolder();
        }
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private filterFile(list: any[], filter) {
    if (filter) {
      let filteredList = list.filter(function (fileName) {
        return fileName.includes(filter);
      })
      return filteredList;
    }
    else {
      let filteredList = list.filter(function (fileName) {
        return fileName.indexOf('profile') === -1;

      })
      return filteredList;

    }
  }
  //=======================================
  //=======================================
  private getSubsciption(calledFrom: string) {
    this.toggleLoader('show');
    let userId = this.dataService.getUserId();
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'login/subscription', { userId: userId }, true).subscribe(
      (response: any) => {
        this.toggleLoader('hide');
        if (response.response.isSuccess) {
          this.dataService.setSubscription(response.response.data);
        }
        if (calledFrom === 'login') {
          this.getDiskUsage(calledFrom);
        }
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private getSearchList(val: any): void {
    this.toggleLoader('show');
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'profile/getSearchList', val, true).subscribe(
      (response: any) => {
        this.toggleLoader('hide');
        if (response.response.isSuccess) {
          if (val.reqMode === 'login') {
            this.dataService.setConnectionList(response.response.data);
            this.messageService.sendMessage({ event: 'onAuthenticate', isSuccess: true })
          }
          else if (val.reqMode === 'search') {
            this.dataService.setSearchList(response.response.data);
            this.messageService.sendMessage({ event: 'onSearchListUpdate' });
          }
          else {
            //=== do we need this
            this.messageService.sendMessage({ event: 'onConnectionUpdate' });
          }
        }
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  public openNav(): void {
    this.isNavOpen = !this.isNavOpen;
  }
  //=======================================
  //=======================================
  public showModal(val): void {
    this.modalContent = val;
    this.modalContent['userId'] = val.userId;
    switch (val.reqType) {
      case 'info':
        this.modalContent['msg'] = val.info;
        break;
      case 'accept':
        this.modalContent['msg'] = 'By accepting connection, ' + val.reqId + ' will be able to see your medical record.';
        break;
      case 'add':
        this.modalContent['msg'] = 'Your request to add connection is sent to ' + val.reqId + '. Once they accept, you will be connected.';
        break;
      case 'sent':
        this.modalContent['msg'] = 'You have already requested connection with  ' + val.reqId + '. Once they accept, you will be connected.';
        break;
    }
    val.reqType = val.reqType === 'sent' ? val.reqType = 'info' : val.reqType;
    document.getElementById('confirmBox').style.display = 'block';
  }
  //=======================================
  //=======================================
  public onHideModal(val): void {
    if (val) {
      this.onSubmitConnection(this.modalContent);
    }
    document.getElementById('confirmBox').style.display = 'none';
  }
  //=======================================
  //=======================================
  private imageUploadRequest(val): void {
    this.uploadFileMode = val.mode;
    if (this.uploadFileMode === 'profile') {
      this.imgSpec = { height: 225, width: 225, size: 25 };
      this.profilePic = this.dataService.getFolderPath() + 'profile.jpg?' + this.dataService.getRandomExt();
    }
    else {
      this.imgSpec = { height: 768, width: 1024, size: 100 };
      this.profilePic = '../../../assets/img/blank-user.jpg?' + this.dataService.getRandomExt();
    }
    this.alertTip = [];
    this.alertTip[0] = `Allowed Height ${this.imgSpec['height']}px. Allowed Width ${this.imgSpec['width']}px. Allowed Size ${this.imgSpec['size']}kb`;
    document.getElementById('uploadBox').style.display = 'block';
  }
  //=======================================
  //=======================================
  public closeUploadBox(): void {
    document.getElementById('uploadBox').style.display = 'none';
  }
  //=======================================
  //=======================================
  public checkPhoto(event: any): void {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.profilePic = event.target.result;
        this.previewImg = event.target.result;
        let size = event.total;
        setTimeout(() => {
          this.checkImageValidaty(Math.round(size / 1024));
          this.previewImg = '';
        }, 250);
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  //=======================================
  //=======================================
  private checkImageValidaty(size: number): void {
    let img: any = document.getElementsByClassName('previewImg')[0];
    this.alertTip[1] = `Selected Height ${img['height']}px. Selected Width ${img['width']}px. Selected Size ${size}kb`;
    if (img.height <= this.imgSpec['height'] && img.width <= this.imgSpec['width'] && size <= this.imgSpec['size']) {
      this.alertTip[2] = 'Click on Submit to Upload  file';
      this.formDisabled = false;
    }
    else {
      this.alertTip[2] = 'Cannot Upload this file';
      this.formDisabled = true;
    }
  }
  //=======================================
  //=======================================
  public showFolder(): void {
    this.viewImage = false;
    document.getElementById('fileListBox').style.display = 'block';
  }
  //=======================================
  //=======================================
  public hideFolder(): void {
    document.getElementById('fileListBox').style.display = 'none';
  }
  //=======================================
  //=======================================
  private toggleLoader(mode): void {
    document.getElementById('loader').style.display = mode === 'show' ? 'block' : 'none';
  }
  //=======================================
  //=======================================
  public showImage(fileName, toggle): void {
    this.viewImage = toggle;
    this.viewImageUrl = this.dataService.getFolderPath() + fileName + '?' + this.dataService.getRandomExt();
  }
  //=======================================
  //=======================================
  public deleteImage(fileName): void {
    let userId = this.dataService.getUserId();
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'util/deleteImg', { userId: userId, mode: fileName }, true).subscribe(
      (response: any) => {
        if (response.response.isSuccess) {
          this.folderList = response.response.fileList;
          this.getFileList(null);
          this.getDiskUsage('manager');
        }
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
}
