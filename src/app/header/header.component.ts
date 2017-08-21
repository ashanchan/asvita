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
    console.log(SERVER_PATH);
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
    let profile = String(this.dataService.getUserId()).substr(0, 3).toLowerCase();
    this.tabs.push({ link: "/dashboard", title: "Dashboard", icon: 'fa fa-home', style: '' });
    this.tabs.push({ link: "/profile-" + profile, title: "Profile", icon: 'fa fa-user', style: '' });
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
      case 'onFileList':
        this.getFileList();
        break;
      case 'onGetConnection':
        this.getConnectionList();
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
            console.log('Oye no name found yaar ', Array.isArray(response.response.data.city));
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
  private getConnectionList(): void {
    let userId = this.dataService.getUserId();
    let httpServiceSubscription = this.httpService.getApiData(SERVER_PATH + 'profile/getProfileList', { userId: userId }, true).subscribe(
      (response: any) => {
        if (response.response.isSuccess) {
          this.dataService.setSearchList(response.response.data);
          this.messageService.sendMessage({ event: 'onConnectionUpdate' });
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
