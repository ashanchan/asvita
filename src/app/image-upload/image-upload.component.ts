import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  @Input() imgSpec: any;
  @Output() imageClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  private previewImg = ""
  private profilePic: string = '../../../assets/img/blank-user.jpg';
  private validIcon: string = '';
  private imgStatus: string = '';

  constructor() { }

  ngOnInit() {
  }
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

  checkImageValidaty(size) {
    let img: any = document.getElementsByClassName('previewImg')[0];
    let success: boolean = false;
    console.log('ht : ', img.height, this.imgSpec.height, ' wd : ', img.width, this.imgSpec.width, ' sz: ', size, this.imgSpec.size);

    if (img.height <= this.imgSpec.height && img.width <= this.imgSpec.width && size <= this.imgSpec.size) {
      this.validIcon = "../../../assets/img/correct.png";
      this.imgStatus = '';
      success = true;
    }
    else {
      this.validIcon = "../../../assets/img/incorrect.png";
      this.imgStatus = "Image Spec does not match";
    }
    this.imageClicked.emit(success);
  }
}
