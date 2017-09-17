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

export class RecordComponent implements OnInit, OnDestroy {
  public recordModel: any = new RecordModel();
  public prescriptionModel: any = new PrescriptionModel();
  public isConnected: boolean = false;
  public userTip: object = {};
  public greeting: object = {};
  public thumbnails: Array<any>;
  public readOnlyData: Array<string> = [];
  public viewMode: string = 'view';
  public tabs: Array<string> = ['View Record', 'Add Record'];
  public tabId: number = 0;
  public recordIdx: number = 0;
  public isDisabled: boolean = false;
  public alertTip: string = '';
  public medicineList: Array<string> = [];

  private userProfileMode: string = '';
  private userProfileData: any;
  private subscription: Subscription;
  private connectedIdx: number = 0;
  private isDoc: boolean = true;
  private isRecordAdded: boolean = false;

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
    this.isDoc = this.userProfileMode === 'DOC';
    this.userTip = this.dataService.getUserTip();
    this.userTip['icon'] = this.userTip['icon'].replace('w3-text-theme', 'w3-text-white');
    this.thumbnails = this.dataService.getUserConnectionList();
    this.prescriptionModel = [];
    for (let i = 0; i < 10; i++) {
      this.prescriptionModel[i] = ({ 'medName': '', 'bbf': '', 'abf': '', 'bl': '', 'al': '', 'eve': '', 'bd': '', 'ad': '', 'day': '' });
    }

    this.createWelcomeCard();
  }
  //=======================================
  //=======================================
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    this.connectedIdx = idx;
    let patientId = this.isDoc ? this.thumbnails[idx].userId : this.userProfileData.userId;
    let model = { patientId: patientId };
    this.messageService.sendMessage({ event: 'onPrescriptionRequest', component: 'record', data: { model: model } });
  }
  //=======================================
  //=======================================
  private findDoctorName(): string {
    let doctorId = this.recordModel[this.recordIdx].doctorId;
    let ctr: number = this.thumbnails.length;
    for (let i = 0; i < ctr; i++) {
      if (this.thumbnails[i].userId === doctorId) {
        return this.thumbnails[i].fullName;
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
        this.connectProfile(this.connectedIdx);
        this.onTabClicked(0);
        break;
      case 'onMedicineListRecd':
        this.medicineList = this.dataService.getMedicineList();
        break;
    }
  }
  //=======================================
  //=======================================
  private createPresciptionForm(data) {
    this.populatePatientData();

    if (data.length >= 1) {
      this.recordModel = data;
      this.recordIdx = 0;
      this.onRecordClicked(0);
      this.isDisabled = true;
    }
    else {
      this.onTabClicked(1);
    }

    this.isConnected = true;
  }
  //=======================================
  //=======================================
  private createReadOnlyData(): void {
    this.readOnlyData['doctorName'] = this.findDoctorName();
    this.readOnlyData['recordDate'] = this.checkDataValue(this.recordModel[this.recordIdx].recordDate);
    this.readOnlyData['referred'] = this.checkDataValue(this.recordModel[this.recordIdx].referred);
    this.readOnlyData['weight'] = this.checkDataValue(this.recordModel[this.recordIdx].weight);
    this.readOnlyData['temprature'] = this.checkDataValue(this.recordModel[this.recordIdx].temprature);
    this.readOnlyData['bp'] = this.checkDataValue(this.recordModel[this.recordIdx].bp);
    this.readOnlyData['pulse'] = this.checkDataValue(this.recordModel[this.recordIdx].pulse);
    this.readOnlyData['diagnosis'] = this.checkDataValue(this.recordModel[this.recordIdx].diagnosis);
    this.readOnlyData['invAdvised'] = this.checkDataValue(this.recordModel[this.recordIdx].invAdvised);
    this.readOnlyData['followUpNotes'] = this.checkDataValue(this.recordModel[this.recordIdx].notes);
    this.readOnlyData['followUp'] = this.checkDataValue(this.recordModel[this.recordIdx].followUp);
    this.readOnlyData['prescription'] = this.recordModel[this.recordIdx].medicine;
  }
  //=======================================
  //=======================================
  private populatePatientData() {
    this.readOnlyData['connectedDoctorId'] = this.isDoc ? this.userProfileData.userId : this.thumbnails[this.connectedIdx].userId;
    this.readOnlyData['doctorName'] = this.isDoc ? this.userProfileData.fullName : this.thumbnails[this.connectedIdx].fullName;
    this.readOnlyData['patientId'] = this.isDoc ? this.thumbnails[this.connectedIdx].userId : this.userProfileData.userId;
    this.readOnlyData['patientName'] = this.isDoc ? this.thumbnails[this.connectedIdx].fullName : this.userProfileData.fullName;
    this.readOnlyData['age'] = this.getAge(this.isDoc ? this.thumbnails[this.connectedIdx].dob : this.userProfileData.dob);
    this.readOnlyData['gender'] = (this.isDoc ? this.thumbnails[this.connectedIdx].gender : this.userProfileData.gender) === 'm' ? 'Gentle Man' : 'Lady';
    this.readOnlyData['allergy'] = this.isDoc ? this.thumbnails[this.connectedIdx].allergy : this.userProfileData.allergy;
    this.readOnlyData['medicalHistory'] = this.isDoc ? this.thumbnails[this.connectedIdx].medicalHistory : this.userProfileData.medicalHistory;
    this.readOnlyData['medicalHistoryOther'] = this.isDoc ? this.thumbnails[this.connectedIdx].medicalHistoryOther : this.userProfileData.medicalHistoryOther;
    this.readOnlyData['lifeStyle'] = this.isDoc ? this.thumbnails[this.connectedIdx].lifeStyle : this.userProfileData.lifeStyle;
    this.readOnlyData['notes'] = this.isDoc ? this.thumbnails[this.connectedIdx].notes : this.userProfileData.notes;
  }
  //=======================================
  //=======================================
  private checkDataValue(val) {
    return val = val === undefined ? '-' : val;
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
    if (this.form.valid && this.validate()) {
      let ctr = this.prescriptionModel.length;
      let medicine = [];
      this.recordModel.medicine = [];
      for (let i = 0; i < ctr; i++) {
        if (this.prescriptionModel[i].medName.trim() !== '') {
          medicine.push(this.prescriptionModel[i]);
        }
      }
      let model = {
        patientId: this.readOnlyData['patientId'],
        doctorId: this.readOnlyData['connectedDoctorId'],
        recordDate: this.recordModel.recordDate,
        referred: this.recordModel.referred,
        weight: this.recordModel.weight,
        bp: this.recordModel.bp,
        temprature: this.recordModel.temprature,
        pulse: this.recordModel.pulse,
        diagnosis: this.recordModel.diagnosis,
        invAdvised: this.recordModel.invAdvised,
        followUp: this.recordModel.followUp,
        notes: this.recordModel.notes,
        medicine: medicine
      }

      if (medicine.length > 0) {
        this.messageService.sendMessage({ event: 'onPrescriptionSubmit', component: 'record', data: { model: model } });
      }
      else {
        this.alertTip = 'Prescription form is empty!!!';
      }
    }
  }
  //=======================================
  //=======================================
  private validate(): boolean {
    let ctr = this.prescriptionModel.length;
    let isEntryValid: boolean = true;
    let val: any = '';
    this.alertTip = '';
    for (let i = 0; i < ctr; i++) {
      val = document.getElementsByClassName('medName')[i];
      this.prescriptionModel[i].medName = val.value;
      isEntryValid = this.isValidEntry(this.prescriptionModel[i], i);
      if (!isEntryValid) {
        break;
      }
    }
    return isEntryValid;
  }
  //=======================================
  //=======================================
  private isValidEntry(entry, idx) {
    let isValid: boolean = true;
    let val = Number(entry.bbf) + Number(entry.abf) + Number(entry.bl) + Number(entry.al) + Number(entry.eve) + Number(entry.bd) + Number(entry.ad);
    if ((val > 0 || isNaN(val)) && entry.medName.trim() === '') {
      this.alertTip += 'Record ' + (idx + 1) + ' Mention medicine name.<br>';
      isValid = false;
    }
    if (val === 0 && entry.medName.trim() !== '') {
      this.alertTip += 'Record ' + (idx + 1) + ' Enter dosage.<br>';
      isValid = false;
    }

    if (isNaN(val)) {
      this.alertTip += 'Record ' + (idx + 1) + ' dosage should be in number.<br>';
      isValid = false;
    }
    return isValid;
  }
  //=======================================
  //=======================================
  private uploadImage() {
    let recordId = this.recordModel[this.recordIdx].prescriptionId + "-record-";
    this.messageService.sendMessage({ event: 'onImageloadRequest', data: { mode: recordId } });
  }
  //=======================================
  //=======================================
  private onRecordClicked(idx: number) {
    this.recordIdx = idx;
    this.createReadOnlyData();
  }
  //=======================================
  //=======================================
  private onTabClicked(idx: number) {
    this.tabId = idx;
    this.viewMode = idx === 0 ? 'view' : 'add';
    if (this.recordModel.length > 1) {
      this.onRecordClicked(0);
    }
    if (!this.isRecordAdded && this.viewMode === 'add') {
      this.medicineList = this.dataService.getMedicineList();
      if (this.medicineList.length === 0) {
        this.messageService.sendMessage({ event: 'onGetMedicineList' });
      }
      this.populatePatientData();
      let tDay = new Date();
      let tMon = tDay.getMonth() + 1 > 9 ? String(tDay.getMonth() + 1) : String('0' + (tDay.getMonth() + 1));
      let dd = tDay.getDate();
      let sdd = dd < 9 ? '0' + dd : dd;
      this.recordModel.recordDate = String(tDay.getFullYear() + '-' + tMon + '-' + sdd);
      this.recordModel.bp = '70/120';
      this.recordModel.pulse = '72';
      this.recordModel.temprature = '98.6';
      this.isRecordAdded = true;
    }
  }
  //=======================================
  //=======================================
  public showFolder() {
    let recordId = this.recordModel[this.recordIdx].prescriptionId;
    this.messageService.sendMessage({ event: 'onShowFolder', data: recordId });
  }
  //=======================================
  //=======================================
  public onRatingClicked(msg: string): void {
    let abc = 'Product List : ' + msg;
    console.log(abc);
  }
}

