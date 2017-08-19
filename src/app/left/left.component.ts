import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from './../services/data.service';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.css']
})

export class LeftPanelComponent implements OnInit, OnDestroy {
  private profilePic: string = '../../assets/img/blank-user.jpg';
  private profileData: any;
  private diskSpace: any = { totalSize: 0, usedSize: 0 }
  private locationInfo: string = '';
  private subscription: Subscription;
  private isAuthenticated: boolean = false;
  //=======================================
  //=======================================
  constructor(private messageService: MessageService, private dataService: DataService) { }
  //=======================================
  //=======================================
  public ngOnInit(): void {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onAuthentication(message);
    });
  }
  //=======================================
  //=======================================
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    setTimeout(() => {
      this.isAuthenticated = false;
    }, 1000);
  }
  //=======================================
  //=======================================
  private onAuthentication(message: any): void {
    switch (message.event) {
      case 'onProfileUpdate':
        this.profileData = this.dataService.getProfileData();
        this.locationInfo = Array.isArray(this.profileData.city) ? this.profileData.city[0] + ',' + this.profileData.state[0] : this.profileData.city + ',' + this.profileData.state;
        this.isAuthenticated = message.isSuccess;
        break;
      case 'onDiskSpaceUpdate':
        this.diskSpace = this.dataService.getDiskSpace();
        break;
      case 'onLogout':
        this.ngOnDestroy();
        break;
    }
  }
  //=======================================
  //=======================================

}
