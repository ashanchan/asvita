import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { MessageService } from './../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { RecordModel } from './../model/record.model'

export class PrescriptionModel {
  constructor(
    public bbf: Array<string> = [],
    public abf: Array<string> = [],
    public bl: Array<string> = [],
    public al: Array<string> = [],
    public eve: Array<string> = [],
    public bd: Array<number> = [],
    public ad: Array<number> = [],
    public day: Array<string> = []
  ) { }
}

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})

export class RecordComponent implements OnInit {
  private recordModel: RecordModel = new RecordModel();
  private prescriptionModel: PrescriptionModel = new PrescriptionModel();
  private subscription: Subscription;
  private isConnected: boolean = false;
  private userTip: object = {};
  private greeting: object = {};
  private thumbnails: Array<any>;
  private readOnlyData: Array<string> = [];
  private recordMode: string = 'view';
  private tabs: Array<string> = ['View Record', 'Add Record'];
  private tabId: number = 0;
  private recordIdx: number = 0;
  private isDisabled: boolean = true;

  @ViewChild('recordForm') form: any;

  constructor(private dataService: DataService, private messageService: MessageService) { }
  //=======================================
  //=======================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
    this.createWelcomeCard();
  }
  //=======================================
  //=======================================
  private createWelcomeCard() {
    this.userTip = this.dataService.getUserTip();
    this.thumbnails = this.dataService.getUserConnectionList();
    let fullName = this.dataService.getProfileData().fullName;
    this.greeting['name'] = 'Hello ' + this.userTip['salutation'] + fullName + '. ';
    this.greeting['msg'] = 'To add presciption record, first you need to select the connection.';
    if (this.thumbnails.length === 0) {
      this.greeting['msg'] += '<br>Your connection list is empty. We Recommand you to click on <b>connect</b> tab, search the connection to add required connections.';
    }
    this.isConnected = false;
  }
  //=======================================
  //=======================================
  private onConnected(idx: number): void {
    let userProfileData = this.dataService.getProfileData();
    let patientId = '';
    if (this.dataService.getUserMode() === 'DOC') {
      this.readOnlyData['doctorName'] = userProfileData.fullName;
      this.readOnlyData['patientName'] = this.thumbnails[idx].fullName;
      this.readOnlyData['age'] = this.getAge(this.thumbnails[idx].dob);
      this.readOnlyData['gender'] = this.thumbnails[idx].gender == 'm' ? 'Male' : 'Female';
      this.readOnlyData['allergy'] = this.thumbnails[idx].allergy;
      this.readOnlyData['medicalHistory'] = this.thumbnails[idx].medicalHistory;
      this.readOnlyData['notes'] = this.thumbnails[idx].medicalHistory;
      this.readOnlyData['lifeStyle'] = this.thumbnails[idx].lifeStyle;
      this.recordModel.patientId = this.thumbnails[idx].userId;
      this.recordModel.doctorId = userProfileData.userId;
    }
    else {
      this.readOnlyData['doctorName'] = this.thumbnails[idx].fullName;
      this.readOnlyData['patientName'] = userProfileData.fullName;
      this.readOnlyData['age'] = this.getAge(userProfileData.dob);
      this.readOnlyData['gender'] = userProfileData.gender == 'm' ? 'Male' : 'Female';
      this.readOnlyData['allergy'] = userProfileData.allergy;
      this.readOnlyData['medicalHistory'] = userProfileData.medicalHistory;
      this.readOnlyData['notes'] = userProfileData.medicalHistory;
      this.readOnlyData['lifeStyle'] = userProfileData.lifeStyle;
      this.recordModel.patientId = userProfileData.userId;
      this.recordModel.doctorId = this.thumbnails[idx].userId;
    }
    let tDay = new Date();
    let tMon = tDay.getMonth() + 1 > 9 ? String(tDay.getMonth() + 1) : String('0' + (tDay.getMonth() + 1));
    this.recordModel.recordDate = String(tDay.getFullYear() + '-' + tMon + '-' + tDay.getDate());
    this.recordModel.bp = '70/120';
    this.recordModel.pulse = '72';
    this.recordModel.temprature = '98.6';
    let model = { patientId: this.recordModel.patientId };
    this.messageService.sendMessage({ event: 'onPrescriptionRequest', component: 'record', data: { model: model } });
  }
  //=======================================
  //=======================================
  private findDoctorName() {
    let doctorId = this.recordModel[this.recordIdx].doctorId;
    let ctr: number = this.thumbnails.length;
    for (let i = 0; i < ctr; i++) {
      if (this.thumbnails[i].userId === doctorId) {
        this.readOnlyData['presribedDocor'] = this.thumbnails[i].fullName;
        break;
      }
    }
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
  private onTabClicked(idx: number) {
    this.recordMode = idx === 0 ? 'view' : 'add';
    this.tabId = idx;
    this.isDisabled = true;
    if (this.recordMode === 'add') {
      this.createPresciptionForm();
      this.isDisabled = false;
      this.recordIdx = 0;
    }
    else {
      this.findDoctorName();
    }

  }
  //=======================================
  //=======================================
  private onRecordClicked(idx: number) {
    this.recordIdx = idx;
    this.findDoctorName();
    this.prescriptionModel = this.recordModel[idx].medicine;
  }
  //=======================================
  //=======================================
  private onMessageReceived(message: any): void {
    switch (message.event) {
      case 'onPrescriptionRecd':
        this.recordModel = message.data;
        this.prescriptionModel = this.recordModel[0].medicine;
        this.recordIdx = 0;
        this.findDoctorName();
        this.createPresciptionForm();
        this.isConnected = true;
        break;
      case 'onPrescriptionSaved':
        this.form.reset();
        break;
    }
  }
  //=======================================
  //=======================================
  private createPresciptionForm() {


  }

}

