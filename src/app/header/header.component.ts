import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { HttpService } from './../services/http.service';
import { DataService } from './../services/data.service';
import { Router } from '@angular/router';

const SERVER_PATH: string = 'http://localhost:1616/';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private isAuthenticated: boolean = false;
  private tabs: any = [];
  private isNavOpen: boolean = true;
  private activeUrl: string = '';
  private routerSubscription;
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
    this.tabs.push({ link: "/dashboard", title: "Dashboard", icon: 'fa fa-home', style: '' });
    this.tabs.push({ link: "/profile-" + profile, title: "Profile", icon: 'fa fa-user', style: '' });
    this.tabs.push({ link: "/record", title: "Record", icon: 'fa fa-medkit', style: '' });
    this.tabs.push({ link: "/image", title: "Upload", icon: 'fa fa-file-archive-o', style: '' });
    this.tabs.push({ link: "/connect", title: "Connect", icon: 'fa fa-handshake-o', style: '' });
    this.tabs.push({ link: "/logout", title: "Logout", icon: 'fa fa-window-close-o', style: 'w3-right' });
  }
  //=======================================
  //=======================================
  private onMessageReceived(message: any): void {
    switch (message.event) {
      case 'onLoginSubmit':
        this.submitLoginData(message.data);
        break;
      case 'onProfileSubmit':
        this.submitProfileData(message.data);
        break;
      case 'onImageSubmit':
        this.submitImageData(message.data);
        break;
      case 'onImageUpload':
        this.getDiskUsage();
        break;
      case 'onSubmitConnection':
        this.onSubmitConnection(message.data);
        break;
      case 'onFileList':
        this.getFileList();
        break;
      case 'onGetSearchList':
        this.getSearchList(message.data);
        break;
      case 'onSendMailRequest':
        this.sendMailRequest(message.data);
        break;

      case 'onPrescriptionSubmit':
        this.submitPrescription(message.data);
        break;


      case 'onLogout':
        this.ngOnDestroy();
        break;
    }
  }
  //=======================================
  //=======================================
  private submitLoginData(val: any): void {
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'login', val.model, true).subscribe(
      (response: any) => {
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
    val.userId = this.dataService.getUserId();
    console.log(val.userId, val.reqId, val.reqMode);
    if (val.reqMode === 'received') {
      let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'profile/updateProfileConnection', val, true).subscribe(
        (response: any) => {
          httpServiceSubscription.unsubscribe();
        }
      )
    }
  }
  //=======================================
  //=======================================
  private submitPrescription(val: any) {
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'util/addPrescription', val.model, true).subscribe(
      (response: any) => {
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private submitProfileData(val: any): void {
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'profile', val.model, true).subscribe(
      (response: any) => {
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
  private submitImageData(val: any): void {
    val.model.userId = this.dataService.getUserId();
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'util/uploadImg', val.model, true).subscribe(
      (response: any) => {
        if (response.success && val.model.mode === 'profile') {
          this.messageService.sendMessage({ event: 'onProfileImageUpdate', mode: '', isSuccess: true });
        }
        this.getDiskUsage();
        this.messageService.sendMessage({ event: 'onImageProcessed', data: response.response, mode: val.mode });
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private sendMailRequest(val: any): void {
    console.log(val.userId, val.fullName, val.requestName, val.requestNumber, val.requestType);
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'util/sendRequestMail', val, true).subscribe(
      (response: any) => {
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
    let userId = this.dataService.getUserId();
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'profile', { userId: userId }, true).subscribe(
      (response: any) => {
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
          this.messageService.sendMessage({ event: 'onProfileUpdate', mode: '', isSuccess: true });
          if (calledFrom === 'login') {
            this.getSubsciption();
            this.createTabs();
            this.getDiskUsage();
            this.isAuthenticated = true;
            this.router.navigate(['./dashboard']);
            this.messageService.sendMessage({ event: 'onAuthenticate', isSuccess: true });
          }
        }
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private getDiskUsage(): void {
    let userId = this.dataService.getUserId();
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'util/diskSpace', { userId: userId }, true).subscribe(
      (response: any) => {
        if (response.response.isSuccess) {
          this.dataService.setDiskSpace(response.response.diskSpace.usedSize);
        }
        this.messageService.sendMessage({ event: 'onDiskSpaceUpdate', isSuccess: true });
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private getFileList(): void {
    let userId = this.dataService.getUserId();
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'util/fileList', { userId: userId }, true).subscribe(
      (response: any) => {
        if (response.response.isSuccess) {
          this.messageService.sendMessage({ event: 'onFileListUpdate', data: response.response });
        }
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private getSubsciption(): void {
    let userId = this.dataService.getUserId();
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'login/subscription', { userId: userId }, true).subscribe(
      (response: any) => {
        if (response.response.isSuccess) {
          this.dataService.setSubscription(response.response.data);
        }
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private getSearchList(val): void {
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'profile/getSearchList', val, true).subscribe(
      (response: any) => {
        if (response.response.isSuccess) {
          if (val.reqMode === 'search') {
            this.dataService.setSearchList(response.response.data);
            this.messageService.sendMessage({ event: 'onSearchListUpdate' });
          }
          else {
            this.dataService.setConnectionList(response.response.data);
            this.messageService.sendMessage({ event: 'onConnectionUpdate' });
          }
        }
        httpServiceSubscription.unsubscribe();
      }
    )
  }
  //=======================================
  //=======================================
  private openNav(): void {
    this.isNavOpen = !this.isNavOpen;
  }
  //=======================================
  //=======================================
}
