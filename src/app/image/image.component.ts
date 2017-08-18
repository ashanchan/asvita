import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { HttpService } from './../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})

export class ImageComponent implements OnInit {
  private userId: string = '';
  private title: string = 'Profile Image';
  private alertTip: string = '';
  private previewImg = "";
  private validIcon: string = '';
  private imgStatus: string = 'Choose File as per Spec';
  private imgSpec: any;
  private formDisabled: boolean = true;
  private profilePic: string = '../../../assets/img/blank-user.jpg';
  @ViewChild('imageForm') form: any;

  constructor(private httpService: HttpService, private dataService: DataService, private router: Router) { }
  //=======================================
  //=======================================
  public ngOnInit(): void {
    this.getData();
  }
  //=======================================
  //=======================================
  private getData(): void {
    this.imgSpec = { height: 400, width: 500, size: 100 };
    this.alertTip = `Allowed Spec [hh x ww & size] <br>[max ${this.imgSpec['height']}px x ${this.imgSpec['width']}px and max size ${this.imgSpec['size']}kb]`;
    this.userId = this.dataService.getUserId();
    let apiUrl = 'http://localhost:1616/profile'

    this.httpService.getApiData(apiUrl, { userId: this.userId }, true).subscribe(
      (response: any) => {
        if (response.response.isSuccess) {
         this.profilePic = response.response.data.profileUrl  ? response.response.data.profileUrl : '../../../assets/img/blank-user.jpg';
        }
      }
    )
	 //this.profilePic = 'http://localhost:1616/uploads/doc-4mzsz8hwj6ex81ar/profile.jpg';
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
    this.imgStatus = `Image Info :  ${img['height']}px x ${img['width']}px and  size ${size}kb]`;
    if (img.height <= this.imgSpec.height && img.width <= this.imgSpec.width && size <= this.imgSpec.size) {
      this.validIcon = "../../../assets/img/correct.png";
      this.formDisabled = false;
    }
    else {
      this.validIcon = "../../../assets/img/incorrect.png";
      this.formDisabled = true;
    }
  }
  //=======================================
  //=======================================
  private onSubmit(): void {
    this.formDisabled = true;
    let apiUrl = 'http://localhost:1616/util/uploadImg';
    let data = { userId: this.userId, filePath: this.profilePic, mode:'profile'}
    this.httpService.getApiData(apiUrl, data, true).subscribe(
      (response: any) => {
        this.imgStatus = response.response.msg;
      }
    )
  }
  //=======================================
  //=======================================

}
