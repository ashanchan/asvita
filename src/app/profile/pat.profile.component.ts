import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { MessageService } from './../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { PatientProfileModel } from './../model/patient.profile.model'

@Component({
  selector: 'app-pat-profile',
  templateUrl: './pat.profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: []
})

export class PatProfileComponent implements OnInit {
  private model: PatientProfileModel = new PatientProfileModel();
  private subscription: Subscription;
  private tabs: Array<string> = [];
  private tabId: number = 0;
  private alertTip: string;
  private medicalHistory = [];
  private formDisabled: boolean = true;
  @ViewChild('profileForm') form: any;

  constructor(private dataService: DataService, private messageService: MessageService) { }

  //=======================================
  //=======================================
  public ngOnInit(): void {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
    this.getData();
  }
  //=======================================
  //=======================================
  private getData(): void {
    this.model.mode = "getProfile";
    this.alertTip = "Before Submit, Fill All Fields with *";
    let profileData = this.dataService.getProfileData();
    for (let i in profileData) {
      let id: string = i;
      this.model[id] = profileData[id];
    }
    this.createFormElements();
  }
  //=======================================
  //=======================================
  private createFormElements() {
    this.tabs = ['Profile', 'General', 'Medical'];
    this.model.profileUrl = this.model.profileUrl === '-' ? '../../../assets/img/blank-user.jpg' : this.model.profileUrl;
    this.createMedicalHistory()
  }
  //=======================================
  //=======================================
  private createMedicalHistory(): void {
    let medicalHistoryLabel = ["LBP", "HBP", "Diabetic", "Heart", "Liver", "Kidney", "Brain", "Psycho", "Lungs"];
    let labelCtr = medicalHistoryLabel.length;
    let modelCtr = this.model.medicalHistory.length;
    let checked: boolean;
    this.medicalHistory = [];
    for (var i = 0; i < labelCtr; i++) {
      checked = false;
      for (var j = 0; j < modelCtr; j++) {
        if (medicalHistoryLabel[i].toLowerCase() === this.model.medicalHistory[j].toLowerCase()) checked = true;
      }
      this.medicalHistory.push({ label: medicalHistoryLabel[i], checked: checked });
    }
  }
  //=======================================
  //=======================================
  private onTabClicked(id: number): void {
    this.tabId = id;
    this.alertTip = "Before Submit, Fill All Fields with *";
  }
  //=======================================
  //=======================================
  private onNext(): void {
    this.onTabClicked(this.tabId + 1)
  }
  //=======================================
  //=======================================
  private setCheckedItems(checkBoxName: string, modelName: string): void {
    this.formDisabled = false;
    this.model[modelName] = this.getCheckedItems(checkBoxName);
    this.createMedicalHistory();
  }
  //=======================================
  //=======================================
  private getCheckedItems(checkBoxName: string): Array<string> {
    let items: any = document.getElementsByName(checkBoxName);
    let ctr: number = items.length;
    let selectedArray: Array<string> = []
    for (var i = 0; i < ctr; i++) {
      if (items[i].checked) selectedArray.push(items[i].value);
    }
    return selectedArray;
  }
  //=======================================
  //=======================================
  private onSubmit(): void {
    if (this.form.valid) {
      this.model.mode = "updateProfile";
      this.formDisabled = true;
      this.messageService.sendMessage({ event: 'onProfileSubmit', component: 'profile', data: { model: this.model } });
    }
  }
  //=======================================
  //=======================================
  private onMessageReceived(message: any): void {
    if (message.event === 'onProfileUpdate' && message.mode === 'updateProfile') {
      this.alertTip = message.data.msg;
    }
  }
  //=======================================
  //=======================================
  private enableform(event) {
    if ((event.type === 'change') || (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete')) {
      this.formDisabled = false;
    }
  }
  //=======================================
  //=======================================
}