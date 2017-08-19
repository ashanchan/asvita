import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { HttpService } from './../services/http.service';
import { MessageService } from './../services/message.service';
import { PatientProfileModel } from './../model/patient.profile.model'

@Component({
  selector: 'app-pat-profile',
  templateUrl: './pat.profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: []
})

export class PatProfileComponent implements OnInit {
  private model: PatientProfileModel = new PatientProfileModel();
  private tabs: Array<string> = [];
  private tabId: number = 0;
  private alertTip: string;
  private medicalHistory = [];
  private formDisabled: boolean = true;
  private hasFormSubmitted: boolean = false;

  @ViewChild('profileForm') form: any;

  constructor(private httpService: HttpService, private dataService: DataService, private messageService: MessageService) { }

  //=======================================
  //=======================================
  public ngOnInit(): void {
    this.getData();
  }
  //=======================================
  //=======================================
  private getData(): void {
    this.alertTip = "Before Submit, Fill All Fields with *";
    this.model.userId = this.dataService.getUserId();
    this.model.mode = "getProfile";
    this.model.userId = this.dataService.getUserId();
    let apiUrl = 'http://localhost:1616/profile'
    let httpServiceSubscription = this.httpService.getApiData(apiUrl, this.model, true).subscribe(
      (response: any) => {
        if (response.response.isSuccess) {
          for (var i in response.response.data) {
            let id: string = i;
            this.model[id] = response.response.data[id];
          }
        }
        httpServiceSubscription.unsubscribe();
        this.createFormElements();
      }
    )
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
    if (this.form.valid && !this.hasFormSubmitted) {
      this.model.mode = "updateProfile";
      this.formDisabled = true;
      let apiUrl = 'http://localhost:1616/profile'
      let httpServiceSubscription = this.httpService.getApiData(apiUrl, this.model, true).subscribe(
        (response: any) => {
          this.alertTip = response.response.msg;
          this.hasFormSubmitted = true;
          this.messageService.sendMessage({ event: 'onUserProfileUpdated', component: 'profile', success: true });
          httpServiceSubscription.unsubscribe();
        }
      )
    }
  }
  //=======================================
  //=======================================
  private onSubmitClicked() {
    this.hasFormSubmitted = false;
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