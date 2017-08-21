import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from './../services/data.service';

class Search {
  constructor(
    public userId: string = '',
    public fullName: string = '',
    public clinic: string = '',
    public city: string = '',
    public pin: string = ''
  ) { }
}


@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})

export class ConnectComponent implements OnInit, OnDestroy {
  private model: Search = new Search();
  private searchData: any;
  private subscription: Subscription;
  private userConnection: any;
  private userId: any;
  private hideRefreshBtn: boolean = false;
  private hideSearchResults: boolean = true;
  //=======================================
  //=======================================
  constructor(private messageService: MessageService, private dataService: DataService) { }
  //=======================================
  //=======================================
  public ngOnInit(): void {
    this.userConnection = this.dataService.getProfileData().connection;
    this.userId = this.dataService.getUserId();
    if (this.dataService.getSearchList()) {
      this.hideRefreshBtn = true;
    }
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
  }
  //=======================================
  //=======================================
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  //=======================================
  //=======================================
  private getConnectionList() {
    this.messageService.sendMessage({ event: 'onGetConnection' });
  }
  //=======================================
  //=======================================
  private onMessageReceived(message: any): void {
    switch (message.event) {
      case 'onConnectionUpdate':
        this.hideRefreshBtn = true;
        break;
    }
  }
  //=======================================
  //=======================================
  private searchAvailableData(): void {
    let data = this.dataService.getSearchList()
    let totalClinic = data.length;
    this.searchData = [];

    for (let i = 0; i < totalClinic; i++) {
      if (data[i].fullName) {
        let userDetail = '<i class="fa fa-id-badge"></i> ' + data[i].userId + '<br>' + '<i class="fa fa-user"></i> ' + 'Dr.' + data[i].fullName + '<br>' + '<i class="fa fa-graduation-cap"></i> ' + data[i].specialization.toString() + '<br>' + '<i class="fa fa-superpowers"></i> ' + data[i].qualification + '<br>' + data[i].specializationOther;
        let clinicDetail = '';
        let ctr = data[i].clinic.length;
        let connection = this.checkConnection(data[i].userId, data[i].connection);

        for (let j = 0; j < ctr; j++) {
          clinicDetail += '<i class="fa fa-university"></i> ' + data[i].clinic[j] + '<br>' + '<i class="fa fa-address-card-o"></i> ' + data[i].address[j] + ' ' + data[i].city[j] + '-' + data[i].pin[j] + '<br>' + '<i class="fa fa-phone"></i> ' + data[i].contact[j] + '<br>' + '<i class="fa fa-clock-o"></i> ' + data[i].openTime[0] + ' - ' + data[0].endTime[j] + '<br>' + '<i class="fa fa-calendar"></i> ' + data[0].openDay[j] + '<hr>';
        }
        let profData = { profPic: this.dataService.getRootPath() + data[i].userId + '/profile.jpg', userDetail: userDetail, clinicDetail: clinicDetail, connection: connection }
        this.searchData[i] = profData;
      }
    }
    this.hideSearchResults = false;
  }
  //=======================================
  //=======================================
  private checkConnection(userId: any, data: any): number {
    //=== chk if user and recd data has match
    let from = String(this.userConnection).split(userId).length > 1;
    let to = String(data).split(this.userId).length > 1;
    let result = 0
    if (!from && to) result = 1;
    if (from && !to) result = 2;
    if (from && to) result = 3;

    return result;
  }
  //=======================================
  //=======================================
  private connectNow(mode: number): void {
    window.alert(mode)
  }
}