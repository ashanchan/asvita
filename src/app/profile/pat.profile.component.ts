import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { HttpService } from './../services/http.service';
import { Router } from '@angular/router';
import { PatientProfileModel } from './../model/patient.profile.model'

@Component({
  selector: 'app-pat-profile',
  templateUrl: './pat.profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: []
})

export class PatProfileComponent implements OnInit {
  private model: PatientProfileModel = new PatientProfileModel();
  private canUploadImage: boolean = false;
  private tabs: Array<string> = [];
  private tabId: number = 0;
  private imgSpec: any;
  private alertTip: string;
  private medicalHistory = [];
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
    this.imgSpec = { height: 100, width: 100, size: 100 };
    this.alertTip = "Before Submit, Fill All Fields with *";
    this.model.userId = this.dataService.getUserId();
	this.model.mode = "getProfile";
    this.model.userId = this.dataService.getUserId();
	let apiUrl = 'http://localhost:1616/profile'
	  this.httpService.getApiData(apiUrl, this.model, true).subscribe(
		(response: any) => {
		  if(response.response.isSuccess)
		  {
			for(var i in response.response.data)
			{
				let id:string = i;
				this.model[id] = response.response.data[id];
			}
		  }
		}
	  )
  }
  //=======================================
  //=======================================
  private createFormElements() {
    this.tabs = ['Profile', 'General', 'Medical'];
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
  private onImageClicked(success: boolean): void {
    this.canUploadImage = success;
  }
  //=======================================
  //=======================================
  private onTabClicked(id: number): void {
    if (this.form.valid) {
      this.tabId = id;
    }
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
}