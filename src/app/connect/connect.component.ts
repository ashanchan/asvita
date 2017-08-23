import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
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

class Request {
  constructor(
    public userId: string = '',
    public fullName: string = '',
    public requestName: string = '',
    public requestNumber: string = '',
    public requestType: string = ''
  ) { }
}

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})

export class ConnectComponent implements OnInit, OnDestroy {
  private model: Search = new Search();
  private reqModel: Request = new Request();
  private searchData: any;
  private subscription: Subscription;
  private profileConnection: any;
  private userId: any;
  private hideRefreshBtn: boolean = false;
  private hideSearchResults: boolean = true;
  private isModalOpen: boolean = false;
  private modalContent: object = {};
  private mode: string = '';
  @ViewChild('requestForm') form: any;

  //=======================================
  //=======================================
  constructor(private messageService: MessageService, private dataService: DataService) { }
  //=======================================
  //=======================================
  public ngOnInit(): void {
    this.profileConnection = { connection: this.dataService.getProfileData().connection, connectionReq: this.dataService.getProfileData().connectionReq };
    this.userId = this.dataService.getUserId();
    this.reqModel.requestType = 'doc';

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
  private getSearchList() {
    this.messageService.sendMessage({ event: 'onGetSearchList', data: { userId: this.userId, reqMode: 'search' } });
  }
  //=======================================
  //=======================================
  private onMessageReceived(message: any): void {
    switch (message.event) {
      case 'onSearchListUpdate':
        this.hideRefreshBtn = true;
        break;
    }
  }
  //=======================================
  //=======================================
  private searchAvailableData(): void {
    let data = this.dataService.getSearchList()
    let totalClinic = data.length;
    let userMode = this.dataService.getUserMode();
    this.searchData = [];

    let profData;

    for (let i = 0; i < totalClinic; i++) {
      if (data[i].fullName) {
        let conStatus = this.checkConnection(data[i].userId, data[i].connection, data[i].connectionReq);
        if (userMode === 'PAT') {
          let userDetail = '<i class="fa fa-id-badge"></i> ' + data[i].userId + '<br>' + '<i class="fa fa-stethoscope"></i> ' + 'Dr.' + data[i].fullName + '<br>' + '<i class="fa fa-graduation-cap"></i> ' + data[i].specialization.toString() + '<br>' + '<i class="fa fa-superpowers"></i> ' + data[i].qualification + '<br>' + data[i].specializationOther;
          let clinicDetail = '';
          let ctr = data[i].clinic.length;

          for (let j = 0; j < ctr; j++) {
            clinicDetail += '<i class="fa fa-university"></i> ' + data[i].clinic[j] + '<br>' + '<i class="fa fa-address-card-o"></i> ' + data[i].address[j] + ' ' + data[i].city[j] + '-' + data[i].pin[j] + '<br>' + '<i class="fa fa-phone"></i> ' + data[i].contact[j] + '<br>' + '<i class="fa fa-clock-o"></i> ' + data[i].openTime[0] + ' - ' + data[0].endTime[j] + '<br>' + '<i class="fa fa-calendar"></i> ' + data[0].openDay[j] + '<hr>';
          }

          profData = { userId: data[i].userId, profPic: this.dataService.getRootPath() + data[i].userId + '/profile_thumb.jpg', userDetail: userDetail, adressDetail: clinicDetail, conStatus: conStatus }
        }
        else {
          let genderIcon = data[i].gender === 'm' ? '<i class="fa fa-male"></i> ' : '<i class="fa fa-female"></i> ';
          let userDetail = '<i class="fa fa-id-badge"></i> ' + data[i].userId + '<br>' + genderIcon + data[i].salutation + '.' + data[i].fullName + '<br>' + '<i class="fa fa-thermometer-empty"></i> ' + data[i].medicalHistory + '<br>' + '<i class="fa fa-thermometer-full"></i> ' + data[i].medicalHistoryOther + '<br>' + '<i class="fa fa-medkit"></i> ' + data[i].allergy;
          let address = '<i class="fa fa-address-card-o"></i> ' + data[i].address + ' ' + data[i].city + '-' + data[i].pin + '<br>' + '<i class="fa fa-phone"></i> ' + data[i].mobile;
          profData = { userId: data[i].userId, profPic: this.dataService.getRootPath() + data[i].userId + '/profile_thumb.jpg', userDetail: userDetail, adressDetail: address, conStatus: conStatus }
        }


        this.searchData[i] = profData;
      }
    }
    this.hideSearchResults = false;
  }
  //=======================================
  //=======================================
  private checkConnection(userId: string, connection: any, connectionReq: any): string {
    //=== chk if user and recd data has match
    let connected = String(this.profileConnection.connection).split(userId).length > 1;
    let sentReq = String(this.profileConnection.connectionReq).split(userId).length > 1;
    let recdReq = String(connectionReq).split(this.userId).length > 1;
    let status = '';

    if (connected) {
      status = 'connected';
    }
    else if (sentReq) {
      status = 'sent';
    }
    else if (recdReq) {
      status = 'received';
    }
    else {
      status = 'needed';
    }

    return status;
  }
  //=======================================
  //=======================================
  private onShowModal(conStatus: string, userId: string): void {
    this.modalContent['conStatus'] = conStatus;
    this.modalContent['userId'] = userId;
    switch (conStatus) {
      case 'needed':
        this.modalContent['msg'] = 'Your connection request will be sent. Once connection is accepted ' + userId + ' will be able to see your record.';
        break;
      case 'sent':
        this.modalContent['msg'] = 'You have already sent request.' + userId + ' still not accepted it.';
        break;
      case 'received':
        this.modalContent['msg'] = 'By accepting connection ' + userId + ' will be able to see your record.';
        break;
      case 'connected':
        this.modalContent['msg'] = 'You are trying to disconnect from ' + userId;
        break;
    }

    document.getElementById('confirmBox').style.display = 'block';
  }
  //=======================================
  //=======================================
  private onHideModal(conDetail: object, confirm: boolean): void {
    document.getElementById('confirmBox').style.display = 'none';
    if (confirm) {
      let reqData = { reqId: conDetail['userId'], reqMode: conDetail['conStatus'] }
      this.messageService.sendMessage({ event: 'onSubmitConnection', data: reqData });
    }
  }
  //=======================================
  //=======================================
  private sendMailRequest(): void {
    this.reqModel.userId = this.userId;
    this.reqModel.fullName = this.dataService.getProfileData().fullName;
    this.messageService.sendMessage({ event: 'onSendMailRequest', data: this.reqModel });
    this.form.reset();
  }
}