import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-image',
    template: `
    <div class="img-panel">
        <img [src]="validIcon" class="valid-icon" />
        <img [src]="profilePic" alt="Avatar" class="img-thumbnail" />
        <div class="photo">
            <p class="required text-center" [innerHTML]="imgStatus"></p>
            <p class="text-center">[max 240px x 240px and max size 100 kb]</p>
            <input type="file" name="photo" id="photoInput" (change)="checkPhoto($event)" #input accept="image/*" />
        </div>
    </div>
    <div class="preview" id="preview">
        <img [src]="previewImg" class="previewImg" />
    </div>
    `,
    styles: [`
    .img-thumbnail {
        width: 150px;
        height: 150px;
        margin: 0 auto 10px;
        display: block;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border-radius: 5px;
    }

    .valid-icon {
        position: relative;
        top: 150px;
        left: 50px;
    }
    `]
})

export class ImageComponent {
    @Input() imgSpec: any;
    @Output() imageClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
    private previewImg = ""
    private profilePic: string = '../../../assets/media/img/login/blank-user.jpg';
    private validIcon: string = '';
    private imgStatus: string = '';

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
            this.validIcon = "../../../assets/media/img/correct.png";
            this.imgStatus = '';
            success = true;
        }
        else {
            this.validIcon = "../../../assets/media/img/incorrect.png";
            this.imgStatus = "Image Spec does not match";
        }
        this.imageClicked.emit(success);
    }
}
