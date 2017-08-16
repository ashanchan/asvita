import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { HttpService } from './../services/http.service';
import { Router } from '@angular/router';
import { ProfileModel } from '../../model/profile.model'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: []
})


export class ProfileComponent implements OnInit {
  private model: ProfileModel = new ProfileModel();
  private canUploadImage: boolean = false;
  private tabs: Array<string> = [];
  private tabId: number = 0;
  private imgSpec: any;
  private submissionSuccess: boolean = false;
  private alertTip: string;
  private mode: string;
  private clinics = [1, 1, 1, 1, 1, 1, 1];
  private validFlag: Array<boolean> = [false, false, false];
  private medicalHistory = [];
  private specialization = [];
  private openDay = [];
  private clinicId: number = 0;
  @ViewChild('profileForm') form: any;

  constructor(private httpService: HttpService, private dataService: DataService, private router: Router) { }

  //=======================================
  //=======================================
  public ngOnInit(): void {
    this.getData();
    this.createFormElements();
  }
  //=======================================
  //=======================================
  private getData(): void {
    this.mode = 'doctors';
    this.imgSpec = { height: 100, width: 100, size: 100 };
    this.submissionSuccess = false;
    this.alertTip = "Before Submit, Fill All Fields with *";
    this.model.salutation = "mr";
    this.model.fullName = "Ashok Anchan";
    this.model.address = ["502-B, Samrat Apartment, Yashwant Nagar, Behind Vakola Church, Santa Cruz - East"];
    this.model.city = ["Mumbai"];
    this.model.pin = ["400055"];
    this.model.state = ["Maharashtra"];
    this.model.mobile = ["9320069001"];
    this.model.sosPerson = "Sky";
    this.model.sosMobile = "1234567890";
    this.model.gender = "o";
    this.model.dob = '2005-08-10';
    this.model.medicalHistory = ['hbp', 'lbp'];
    this.model.medicalHistoryOther = 'Obese';
    this.model.allergy = 'smoke, dust';
    this.model.clinic = ["Shashtri", "Sona", "Niron"];
    this.model.openTime = [10, 12, 13, 18];
    this.model.endTime = [11, 13, 14, 20];
    this.model.openDay = ["Mon,Tue,Fri,Holiday", "Sun,Sat"];
    this.model.specialization = ["Anesthesiologist", "Pediatrician", "Urologist"];
    this.model.specializationOther = "Reikei";
  }
  //=======================================
  //=======================================
  private createFormElements() {
    if (this.mode === 'doctor') {
      this.tabs = ['Profile', 'Clinic', 'Specialization'];
      this.createDays();
      this.createDoctorSpecialization();
    }
    else {
      this.tabs = ['Profile', 'General', 'Medical'];
      this.createMedicalHistory()
    }
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
  private createDoctorSpecialization(): void {
    let specializationLabel = ["Anesthesiologist", "Cardiologist", "Dentist", "Dermatologist", "Endocrinologist", "ENT Doctor", "Gastrologist", "General Physician", "General Surgeon", "Gynecologist", "Nephrologist", "Neurologist", "Oncologist", "Ophthalmologist", "Orthopedic", "Pathologist", "Pediatrician", "Physio Therapist", "Radiologists", "Urologist"];
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
  private onImageClicked(success: boolean): void {
    this.canUploadImage = success;
  }
  //=======================================
  //=======================================
  private onTabClicked(id: number): void {
    if (this.form.valid) {
      this.tabId = id;
    }
  }
  //=======================================
  //=======================================
  private onNext(): void {
    this.onTabClicked(this.tabId + 1)
  }
  //=======================================
  //=======================================
  private setCheckedItems(checkBoxName: string, modelName: string): void {
    switch (checkBoxName) {
      case 'day':
        this.model[modelName][this.clinicId] = this.getCheckedItems(checkBoxName).toString();
        this.createDays();
        break;
      case 'specialization':
        this.model[modelName] = this.getCheckedItems(checkBoxName);
        this.createDoctorSpecialization();
        break;
      case 'history':
        this.model[modelName] = this.getCheckedItems(checkBoxName);
        this.createMedicalHistory();
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
    this.submissionSuccess = true;
    if (this.mode === 'doctor') {
      this.submissionSuccess = (this.model.specialization.length > 0 || this.model.specializationOther.length > 0) && this.model.openDay.length > 0;
    }
    return this.submissionSuccess;
  }
  //=======================================
  //=======================================
  private onSubmit(): void {
    if (this.form.valid && this.chkValidation()) {
      let apiUrl = 'http://localhost:1616/profile'
      this.httpService.getApiData(apiUrl, this.model, true).subscribe(
        (response: Response) => {
         // this.onProcess(mode, response);
        }
      )
      this.form.reset();
    }
  }
  //=======================================
  //=======================================
}