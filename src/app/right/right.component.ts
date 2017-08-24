import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from './../services/data.service';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.css']
})

export class RightPanelComponent implements OnInit, OnDestroy {
  private profilePic: string = '../../assets/img/blank-user.jpg';
  private profileData: any;
  private userSubscription: object = {};
  private locationInfo: string = '';
  private subscription: Subscription;
  private isAuthenticated: boolean = false;
  private thumbnails: any = [];
  private userTip: any = {};
  //=======================================
  //=======================================
  constructor(private messageService: MessageService, private dataService: DataService) { }
  //=======================================
  //=======================================
  public ngOnInit(): void {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
    this.userTip = this.dataService.getUserTip();
  }
  //=======================================
  //=======================================
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    setTimeout(() => {
      this.profilePic = '../../assets/img/blank-user.jpg';
      this.isAuthenticated = false;
    }, 1000);
  }
  //=======================================
  //=======================================
  private onMessageReceived(message: any): void {
    switch (message.event) {
      case 'onAuthenticate':
      case 'onProfileImageUpdate':
      case 'onProfileUpdate':
      case 'onDiskSpaceUpdate':
      case 'onConnectionUpdate':
        this.updatePanel();
        this.isAuthenticated = true;
        break;
    }
  }
  //=======================================
  //=======================================
  private updatePanel() {
    this.profilePic = this.dataService.getFolderPath() + 'profile.jpg?' + this.dataService.getRandomExt();
    let sub = this.dataService.getSubscription();

    this.profileData = this.dataService.getProfileData();
    this.locationInfo = Array.isArray(this.profileData.city) ? this.profileData.city[0] + ',' + this.profileData.state[0] : this.profileData.city + ',' + this.profileData.state;
    this.userSubscription['usedSize'] = this.dataService.getDiskSpace();
    this.userSubscription['totalSize'] = sub.diskSpace;
    this.userSubscription['startFrom'] = this.dataService.getConvertedDate(sub.startFrom);
    this.userSubscription['expiresOn'] = this.dataService.getConvertedDate(sub.expiresOn);
    this.userSubscription['addOn'] = sub.addOn === '' ? '-' : sub.addOn;

    this.thumbnails = this.dataService.getUserConnectionList();
  }
  //=======================================
  //=======================================

}
