import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  private greeting: object = {};
  private connectedThumbnails: any = [];
  private requestedThumbnails: any = [];
  private userTip: object = {};

  //=======================================
  //=======================================
  constructor(private messageService: MessageService, private dataService: DataService) { }
  //=======================================
  //=======================================
  public ngOnInit() {
    let userTip = this.dataService.getUserTip();
    let fullName = this.dataService.getProfileData().fullName;
    if (fullName === '') {
      this.greeting['msg'] = 'Welcome. You are a new user. Please click on Profile Section and update your records.'
    }
    else {
      this.greeting['msg'] = 'London is the most populous city in the United Kingdom, with a metropolitan area of over 9 million inhabitants.';
    }
    this.greeting['name'] = 'Hello ' + userTip['salutation'] + fullName;
    this.userTip = this.dataService.getUserTip();

    this.connectedThumbnails = this.dataService.getUserConnectionReqList();
    this.requestedThumbnails = this.dataService.getUserSentReqList();
  }
  //=======================================
  //=======================================
  private onRequestConnection(conId: string): void {
    let profileData = this.dataService.getProfileData();
    let data = { reqType: 'accept', userId: profileData, reqId: conId, connection: profileData.connection, connectionReq: profileData.connectionReq }
    this.messageService.sendMessage({ event: 'onShowModal', data: data });
  }
  //=======================================
  //=======================================

}
