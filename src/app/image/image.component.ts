import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { HttpService } from './../services/http.service';
import { fadeInAnimation } from "./../animation/fade.animation";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})

export class ImageComponent implements OnInit {
  private userId: string = '';
  private title: string = 'Profile Image';
  private alertTip: any = [];
  private previewImg = "";
  private imgSpec: any;
  private formDisabled: boolean = true;
  private profilePic: string = '../../../assets/img/blank-user.jpg';
  @ViewChild('imageForm') form: any;

  constructor(private httpService: HttpService, private dataService: DataService) { }
  //=======================================
  //=======================================
  public ngOnInit(): void {
    this.getData();
  }
  //=======================================
  //=======================================
  private getData(): void {
    this.imgSpec = { height: 400, width: 500, size: 100 };
    this.alertTip[0] = `Allowed Height ${this.imgSpec['height']}px`;
    this.alertTip[1] = `Allowed Width ${this.imgSpec['width']}px`;
    this.alertTip[2] = `Allowed Size ${this.imgSpec['size']}kb`;

    this.userId = this.dataService.getUserId();
    let apiUrl = 'http://localhost:1616/profile'

    this.httpService.getApiData(apiUrl, { userId: this.userId }, true).subscribe(
      (response: any) => {
        if (response.response.isSuccess) {
          this.profilePic = response.response.data.profileUrl;
        }
        this.profilePic = this.profilePic !== '-' ? this.profilePic : '../../../assets/img/blank-user.jpg';
      }
    )

  }
  //=======================================
  //=======================================
  checkPhoto(event) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.profilePic = event.target.result;
        this.previewImg = event.target.result;
        let size = event.total;
        setTimeout(() => {
          this.checkImageValidaty(Math.round(size / 1024));
          this.previewImg = '';
        }, 250);
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  //=======================================
  //=======================================
  checkImageValidaty(size) {
    let img: any = document.getElementsByClassName('previewImg')[0];
    let success: boolean = false;
    this.alertTip[3] = `Selected Height ${img['height']}px`;
    this.alertTip[4] = `Selected Width ${img['width']}px`;
    this.alertTip[5] = `Selected Size ${size}kb`;
    if (img.height <= this.imgSpec.height && img.width <= this.imgSpec.width && size <= this.imgSpec.size) {
      this.formDisabled = false;
      this.alertTip[6] = 'Click on Submit to Upload  file';
    }
    else {
      this.formDisabled = true;
      this.alertTip[6] = 'Cannot Upload this file';
    }
  }
  //=======================================
  //=======================================
  private onSubmit(): void {
    this.formDisabled = true;
    let apiUrl = 'http://localhost:1616/util/uploadImg';
    let data = { userId: this.userId, filePath: this.profilePic, mode: 'profile' }
    this.httpService.getApiData(apiUrl, data, true).subscribe(
      (response: any) => {
        this.alertTip[6] = '<strong>' + response.response.msg + '</strong>';
      }
    )
  }
  //=======================================
  //=======================================

}
