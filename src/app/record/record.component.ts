import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { MessageService } from './../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { RecordModel } from './../model/record.model'

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})

export class RecordComponent implements OnInit {
  private model: RecordModel = new RecordModel();
  private subscription: Subscription;
  private records: any = [];
  private recordIdx: number = 1;
  private minRecordIdx: number = 1;
  private isConnected: boolean = false;
  private thumbnails: any;
  private greeting: object = {};
  private userTip: object = {};
  private readOnlyData: object = {};

  @ViewChild('recordForm') form: any;

  constructor(private dataService: DataService, private messageService: MessageService) { }
  //=======================================
  //=======================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
    this.updateInitialRecord();
  }
  //=======================================
  //=======================================
  private updateInitialRecord() {
    this.userTip = this.dataService.getUserTip();
    let fullName = this.dataService.getProfileData().fullName;
    this.greeting['name'] = 'Hello ' + this.userTip['salutation'] + fullName + '. ';
    this.greeting['msg'] = 'To add presciption record, first you need to select the connection.';
    this.thumbnails = this.dataService.getUserConnectionList();
  }
  //=======================================
  //=======================================
  private onConnected(idx: number): void {
    let userProfileData = this.dataService.getProfileData();
    if (this.dataService.getUserMode() === 'DOC') {
      this.readOnlyData['doctorName'] = userProfileData.fullName;
      this.readOnlyData['patientName'] = this.thumbnails[idx].fullName;
      this.readOnlyData['age'] = this.getAge(this.thumbnails[idx].dob);
      this.readOnlyData['gender'] = this.thumbnails[idx].gender == 'm' ? 'Male' : 'Female';
      this.model.patientId = this.thumbnails[idx].userId;
      this.model.doctorId = userProfileData.userId;
    }
    else {
      this.readOnlyData['doctorName'] = this.thumbnails[idx].fullName;
      this.readOnlyData['patientName'] = userProfileData.fullName;
      this.readOnlyData['age'] = this.getAge(userProfileData.dob);
      this.readOnlyData['gender'] = userProfileData.gender == 'm' ? 'Male' : 'Female';
      this.model.patientId = userProfileData.userId;
      this.model.doctorId = this.thumbnails[idx].userId;
    }
    let tDay = new Date();
    let tMon = tDay.getMonth() + 1 > 9 ? String(tDay.getMonth() + 1) : String('0' + (tDay.getMonth() + 1));
    this.model.recordDate = String(tDay.getFullYear() + '-' + tMon + '-' + tDay.getDate());
    this.model.bp = '70/120';
    this.model.pulse = '72';
    this.model.temprature = '98.6';
    this.isConnected = true;
  }
  //=======================================
  //=======================================
  private getAge(dob) {
    var dobYY = Number(dob.split('-')[0]);
    var cDay = new Date().getFullYear();
    return cDay - dobYY;
  }
  //=======================================
  //=======================================
  private onSubmit() {
    if (this.form.valid) {
      this.messageService.sendMessage({ event: 'onPrescriptionSubmit', component: 'record', data: { model: this.model } });
    }
  }
  //=======================================
  //=======================================
  private onMessageReceived(message: any): void {
    if (message.event === 'onPrescriptionSaved') {
      this.form.reset()
    }
  }
  //=======================================
  //=======================================

}

