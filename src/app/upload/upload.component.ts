import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { MessageService } from './../services/message.service';
import { Subscription } from 'rxjs/Subscription';

class Record {
  constructor(
    public recordNum: string = '',
    public recordDate: string = ''
  ) { }
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, OnDestroy {
  private model: Record = new Record();
  private subscription: Subscription;
  private userId: string = '';
  private alertTip: any = [];
  private previewImg = "";
  private imgSpec: any;
  private formDisabled: boolean = true;
  private profilePic: string = '../../../assets/img/blank-user.jpg';
  private tabs: any;
  private tabId: number = 0;
  private fileName: string = '';
  private fileList: any;
  @ViewChild('imageForm') form: any;

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
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  //=======================================
  //=======================================
  private getData(): void {
    this.tabs = [];
    this.tabs.push({ mode: 'Profile', imgSpec: { height: 225, width: 225, size: 25 } });
    this.tabs.push({ mode: 'Medical', imgSpec: { height: 768, width: 1024, size: 100 } });
    this.tabs.push({ mode: 'Manage', imgSpec: { height: 0, width: 0, size: 0 } });
    this.updateImageSpec();
  }
  //=======================================
  //=======================================
  private updateImageSpec() {
    if (this.tabId !== 2) {
      this.alertTip = [];
      this.alertTip[0] = `Allowed Height ${this.tabs[this.tabId].imgSpec['height']}px`;
      this.alertTip[1] = `Allowed Width ${this.tabs[this.tabId].imgSpec['width']}px`;
      this.alertTip[2] = `Allowed Size ${this.tabs[this.tabId].imgSpec['size']}kb`;
      if (this.tabs[this.tabId].mode === 'Profile') {
        this.profilePic = this.dataService.getFolderPath() + 'profile.jpg?' + this.dataService.getRandomExt();
        this.fileName = 'profile';
      }
      else {
        this.profilePic = '../../../assets/img/blank-user.jpg?' + this.dataService.getRandomExt();
        this.fileName = 'med-';
      }
    }

  }
  //=======================================
  //=======================================
  private getFileList(): void {
    this.messageService.sendMessage({ event: 'onFileList', component: 'image' });
  }
  //=======================================
  //=======================================
  private onTabClicked(idx: number): void {
    this.tabId = idx;
    this.updateImageSpec();
  }
  //=======================================
  //=======================================
  private checkPhoto(event: any): void {
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
  private checkImageValidaty(size: number): void {
    let img: any = document.getElementsByClassName('previewImg')[0];
    let success: boolean = false;
    this.alertTip[3] = `Selected Height ${img['height']}px`;
    this.alertTip[4] = `Selected Width ${img['width']}px`;
    this.alertTip[5] = `Selected Size ${size}kb`;
    if (img.height <= this.tabs[this.tabId].imgSpec.height && img.width <= this.tabs[this.tabId].imgSpec.width && size <= this.tabs[this.tabId].imgSpec.size) {
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
    this.fileName = this.fileName === 'profile' ? 'profile' : String(this.model.recordDate) + '-med-' + String(this.model.recordNum).trim();
    let model = { filePath: this.profilePic, mode: this.fileName };
    this.formDisabled = true;
    this.messageService.sendMessage({ event: 'onImageSubmit', component: 'image', data: { model: model } });
  }
  //=======================================
  //=======================================
  private onMessageReceived(message: any): void {
    switch (message.event) {
      case 'onImageUploaded':
        this.alertTip[6] = '<strong>' + message.data.msg + '</strong>';
        break;
      case 'onFileListUpdate':
        this.fileList = message.data.fileList;
        break;
    }
  }
  //=======================================
  //=======================================
}