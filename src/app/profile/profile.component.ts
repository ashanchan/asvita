import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { MessageService } from './../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { DoctorProfileModel } from './../model/doctor.profile.model';
import { PatientProfileModel } from './../model/patient.profile.model'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  private model: any;
  private profileUrl: string = '';
  private subscription: Subscription;
  private tabs: Array<string> = [];
  private tabId: number = 0;
  private alertTip: string;
  private medicalHistory = [];
  private specialization = [];
  private openDay = [];
  private clinicId: number = 0;
  private formDisabled: boolean = true;
  private profileMode: string;

  @ViewChild('profileForm') form: any;

  constructor(private dataService: DataService, private messageService: MessageService) { }

  public ngOnInit(): void {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      //this.onMessageReceived(message);
    });
    this.profileMode = this.dataService.getUserMode();
    this.model = this.profileMode === 'DOC' ? new DoctorProfileModel() : new PatientProfileModel();
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
    this.profileUrl = this.dataService.getFolderPath() + 'profile.jpg?' + this.dataService.getRandomExt();

    if (this.profileMode === 'DOC') {
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
    switch (checkBoxName) {
      case 'day':
        this.model[modelName][this.clinicId] = this.getCheckedItems(checkBoxName).toString();
        this.createDays();
        break;
      case 'specialization':
        this.model[modelName] = this.getCheckedItems(checkBoxName);
        this.createDoctorSpecialization();
        break;
      case 'medicalHistory':
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
    if (this.profileMode === 'DOC') {
      return (this.model.specialization.length > 0 || this.model.specializationOther.length > 0) && this.model.openDay.length > 0;
    }
    else {
      return true;
    }
  }
  //=======================================
  //=======================================
  private onSubmit(): void {
    if (this.form.valid && this.chkValidation()) {
      this.model.mode = "updateProfile";
      this.formDisabled = true;
      this.messageService.sendMessage({ event: 'onProfileSubmit', component: 'profile', data: { model: this.model } });
    }
  }
  //=======================================
  //=======================================
  private onMessageReceived(message: any): void {
    switch (message.event) {
      case 'onProfileUpdate':
        if (message.mode === 'updateProfile') {
          this.alertTip = message.data.msg;
        }
        break;
      case 'onProfileImageUpdate':
        this.profileUrl = this.dataService.getFolderPath() + 'profile.jpg?' + this.dataService.getRandomExt();
        break;
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
  private uploadImage() {
    this.messageService.sendMessage({ event: 'onImageloadRequest', data: { mode: 'profile', fileName: 'profile' } });
  }
  //=======================================
  //=======================================
}
