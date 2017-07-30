import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { PatientProfileModel } from '../../model/patient-profile.model'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: []
})


export class ProfileComponent implements OnInit {
  private model: PatientProfileModel = new PatientProfileModel();
  private canUploadImage: boolean = false;
  private tabId: number = 0;
  private previewImg;
  private validIcon;
  private imgSpec: any;
  private submissionSuccess: boolean = false;
  private alertTip: string;
  private imgStatus: string = '';
  private mode: string = 'doctor';
  private clinics = [1];
  @ViewChild('profileForm') form: any;

  ngOnInit() {
    this.imgSpec = { height: 100, width: 100, size: 100 };
    this.validIcon = "";
    this.model.salutation = "dr";
    this.model.fullName = "Ashok Anchan";
    this.model.address1 = "502-B, Samrat Apartment";
    this.model.address2 = "Yashwant Nagar, Behind Vakola Church, Santa Cruz - East";
    this.model.city = "Mumbai";
    this.model.pin = "400055";
    this.model.state = "Maharashtra";
    this.model.mobile = "9320069001";
    this.model.sosPerson = "Sky";
    this.model.sosMobile = "100";
    this.model.gender = "o";
    this.model.dob = '2005/01/01';
    this.submissionSuccess = false;
    this.alertTip = "Required Fields are not valid or empty";
  }

  onTabClicked(id) {
    this.tabId = id;
  }

  onNext() {
    this.onTabClicked(this.tabId + 1)
  }

  onImageClicked(success: boolean): void {
    this.canUploadImage = success;
  }


}