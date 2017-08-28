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
  public recordModel: any;
  public prescriptionModel: any = [];
  public subscription: Subscription;
  public isConnected: boolean = false;
  public userTip: object = {};
  public greeting: object = {};
  public thumbnails: Array<any>;
  public readOnlyData: Array<string> = [];
  public recordMode: string = 'view';
  public tabs: Array<string> = ['View Record', 'Add Record'];
  public tabId: number = 0;
  public recordIdx: number = 0;
  public isDisabled: boolean = false;
  public userProfileMode: string = '';
  public userProfileData: any;
  @ViewChild('recordForm') form: any;
  //=======================================
  //=======================================
  constructor(private dataService: DataService, private messageService: MessageService) { }
  //=======================================
  //=======================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
    this.userProfileMode = this.dataService.getUserMode();
    this.userProfileData = this.dataService.getProfileData();
    this.userTip = this.dataService.getUserTip();
    this.thumbnails = this.dataService.getUserConnectionList();
    this.recordModel = {};
    this.prescriptionModel = [];
    this.createWelcomeCard();
  }
  //=======================================
  //=======================================
  private createWelcomeCard() {
    let fullName = this.userProfileData.fullName;
    this.greeting['name'] = 'Hello ' + this.userTip['salutation'] + fullName + '. ';
    this.greeting['msg'] = 'To add presciption record, first you need to select the connection.';
    if (this.thumbnails.length === 0) {
      this.greeting['msg'] += '<br>Your connection list is empty. We Recommand you to click on <b>connect</b> tab, search the connection to add required connections.';
    }
    this.isConnected = false;
  }
  //=======================================
  //=======================================
  public connectProfile(idx: number): void {
    this.createReadOnlyData(idx);
    let model = { patientId: this.readOnlyData['patientId'] };
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
  private onMessageReceived(message: any): void {
    switch (message.event) {
      case 'onPrescriptionRecd':
        this.createPresciptionForm(message.data);
        break;
      case 'onPrescriptionSaved':
        this.form.reset();
        break;
    }
  }
  //=======================================
  //=======================================
  private createPresciptionForm(data) {
    if (data.length > 0) {
      this.prescriptionModel = this.recordModel[0].medicine;
      this.recordIdx = 0;
      this.findDoctorName();
    }
    else {

    }
    this.isConnected = true;
  }
  //=======================================
  //=======================================
  private createReadOnlyData(idx: number): void {
    let isDoc: boolean = this.userProfileMode === 'DOC';
    this.readOnlyData['doctorName'] = isDoc ? this.userProfileData.fullName : this.thumbnails[idx].fullName;
    this.readOnlyData['doctorId'] = isDoc ? this.userProfileData.userId : this.thumbnails[idx].userId;
    this.readOnlyData['patientName'] = isDoc ? this.thumbnails[idx].fullName : this.userProfileData.fullName;
    this.readOnlyData['patientId'] = isDoc ? this.thumbnails[idx].userId : this.userProfileData.userId;
    this.readOnlyData['age'] = this.getAge(isDoc ? this.thumbnails[idx].dob : this.userProfileData.dob);
    this.readOnlyData['gender'] = (isDoc ? this.thumbnails[idx].gender : this.userProfileData.gender) === 'm' ? 'Gentle Man' : 'Lady';
    this.readOnlyData['allergy'] = isDoc ? this.thumbnails[idx].allergy : this.userProfileData.allergy;
    this.readOnlyData['medicalHistory'] = isDoc ? this.thumbnails[idx].medicalHistory : this.userProfileData.medicalHistory;
    this.readOnlyData['medicalHistoryOther'] = isDoc ? this.thumbnails[idx].medicalHistoryOther : this.userProfileData.medicalHistoryOther;
    this.readOnlyData['lifeStyle'] = isDoc ? this.thumbnails[idx].lifeStyle : this.userProfileData.lifeStyle;
    this.readOnlyData['notes'] = isDoc ? this.thumbnails[idx].notes : this.userProfileData.notes;
    this.recordModel.patientId = this.readOnlyData['patientId'];
    this.recordModel.doctorId = this.readOnlyData['doctorId'];

    //================
    let tDay = new Date();
    let tMon = tDay.getMonth() + 1 > 9 ? String(tDay.getMonth() + 1) : String('0' + (tDay.getMonth() + 1));
    this.recordModel.recordDate = String(tDay.getFullYear() + '-' + tMon + '-' + tDay.getDate());
    this.recordModel.bp = '70/120';
    this.recordModel.pulse = '72';
    this.recordModel.temprature = '98.6';
    for (let i = 0; i < 10; i++) {
      this.prescriptionModel[i] = ({ 'medName': '', 'bbf': '', 'abf': '', 'bl': '', 'al': '', 'eve': '', 'bd': '', 'ad': '', 'day': '' });
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
  public onSubmit() {
    if (this.form.valid) {
      //this.recordModel.
      let record = { 'medName': 'Asparin2', 'bbf': '1', 'abf': '1', 'bl': '', 'al': '', 'eve': '', 'bd': '', 'ad': '', 'day': '1' };
      let record2 = { 'medName': 'Parcetamol2', 'bbf': '1', 'abf': '1', 'bl': '', 'al': '', 'eve': '', 'bd': '1', 'ad': '1', 'day': '2' };
      //  this.model.medicine.push(record)
      //  this.model.medicine.push(record2)
      console.log('what am I');
      //   this.messageService.sendMessage({ event: 'onPrescriptionSubmit', component: 'record', data: { model: this.model } });
    }
  }
  //=======================================
  //=======================================
  private uploadImage() {
    this.messageService.sendMessage({ event: 'onImageloadRequest', data: { mode: 'record' } });
  }

}

