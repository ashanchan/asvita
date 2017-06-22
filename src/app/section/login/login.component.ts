import { Component, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})

export class LoginComponent implements OnInit {
  private sectionData: object = {};

  constructor(private dataService: DataService) { }

  ngOnInit() {
    // this.sectionData = this.dataService.getSectionData('login');
  }

 
}
