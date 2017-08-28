import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public copyright: string = ''
  //=======================================
  //=======================================
  constructor() { }
  //=======================================
  //=======================================
  ngOnInit() {
    this.copyright = '© copyright ' + new Date().getFullYear() + ' AsViTa&nbsp;&nbsp;';
  }
  //=======================================
  //=======================================
}
