import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { HttpService } from './../services/http.service';
import { Router } from '@angular/router';
import { DoctorProfileModel } from './../model/doctor.profile.model'

@Component({
  selector: 'app-doc-profile',
  templateUrl: './doc.profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: []
})

export class DocProfileComponent implements OnInit {
  private model: DoctorProfileModel = new DoctorProfileModel();
  private tabs: Array<string> = [];
  private tabId: number = 0;
  private alertTip: string;
  private clinics = [1, 1, 1, 1, 1, 1, 1];
  private validFlag: Array<boolean> = [false, false, false];
  private medicalHistory = [];
  private specialization = [];
  private openDay = [];
  private clinicId: number = 0;
  private formDisabled: boolean = true;
  @ViewChild('profileForm') form: any;

  constructor(private httpService: HttpService, private dataService: DataService, private router: Router) { }

  //=======================================
  //=======================================
  public ngOnInit(): void {
    this.getData();
  }
  //=======================================
  //=======================================
  private getData(): void {
    this.model.mode = "getProfile";
    this.alertTip = "Before Submit, Fill All Fields with *";
    this.model.userId = this.dataService.getUserId();
    let apiUrl = 'http://localhost:1616/profile'
    this.httpService.getApiData(apiUrl, this.model, true).subscribe(
      (response: any) => {
        if (response.response.isSuccess) {
          for (var i in response.response.data) {
            let id: string = i;
            this.model[id] = response.response.data[id];
          }
        }
        this.createFormElements();
      }
    )

  }
  //=======================================
  //=======================================
  private createFormElements() {
    this.tabs = ['Profile', 'Clinic', 'Specialization'];
    this.model.profileUrl = this.model.profileUrl === '-' ? '../../../assets/img/blank-user.jpg' : this.model.profileUrl;
    this.createDays();
    this.createDoctorSpecialization();
  }
  //=======================================
  //=======================================
  private createDoctorSpecialization(): void {
    let specializationLabel = ["Anesthesiologist", "Cardiologist", "Dentist", "Dermatologist", "Endocrinologist", "ENT Doctor", "Gastrologist", "Gen Physician", "Gen Surgeon", "Gynecologist", "Nephrologist", "Neurologist", "Oncologist", "Ophthalmologist", "Orthopedic", "Pathologist", "Pediatrician", "Physio Therapist", "Radiologists", "Urologist"];
    let labelCtr = specializationLabel.length;
    let modelCtr = this.model.specialization.length;
    let checked: boolean;
    this.specialization = [];
    for (var i = 0; i < labelCtr; i++) {
      checked = false;
      for (var j = 0; j < modelCtr; j++) {
        if (specializationLabel[i].toLowerCase() === this.model.specialization[j].toLowerCase()) checked = true;
      }
      this.specialization.push({ label: specializationLabel[i], checked: checked });
    }
  }
  //=======================================
  //=======================================
  private createDays(): void {
    let dayLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Holiday"];
    let labelCtr = dayLabel.length;
    let clinicDays = this.model.openDay[this.clinicId] ? this.model.openDay[this.clinicId].split(',') : '';
    let modelCtr = clinicDays.length;
    let checked: boolean;
    this.openDay = [];
    for (var i = 0; i < labelCtr; i++) {
      checked = false;
      for (var j = 0; j < modelCtr; j++) {
        if (dayLabel[i].toLowerCase() === clinicDays[j].toLowerCase()) checked = true;
      }
      this.openDay.push({ label: dayLabel[i], checked: checked });
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
    switch (checkBoxName) {
      case 'day':
        this.model[modelName][this.clinicId] = this.getCheckedItems(checkBoxName).toString();
        this.createDays();
        break;
      case 'specialization':
        this.model[modelName] = this.getCheckedItems(checkBoxName);
        this.createDoctorSpecialization();
        break;
    }
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
  private onClinicClicked(id: number): void {
    this.clinicId = id;
    this.createDays();
  }
  //=======================================
  //=======================================
  private chkValidation(): boolean {
    return (this.model.specialization.length > 0 || this.model.specializationOther.length > 0) && this.model.openDay.length > 0;
  }
  //=======================================
  //=======================================
  private onSubmit(): void {
    if (this.form.valid && this.chkValidation()) {
      this.model.mode = "updateProfile";
      this.formDisabled = true;
      let apiUrl = 'http://localhost:1616/profile'
      this.httpService.getApiData(apiUrl, this.model, true).subscribe(
        (response: any) => {
          this.alertTip = response.response.msg;
        }
      )
    }
  }
  //=======================================
  //=======================================
  private enableform(event) {
    if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete') {
      this.formDisabled = false;
    }
  }
  //=======================================
  //=======================================
}