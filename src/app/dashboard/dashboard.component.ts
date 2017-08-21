import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  private greeting: object = {};
  //=======================================
  //=======================================
  constructor(private dataService: DataService) { }
  //=======================================
  //=======================================
  public ngOnInit() {
    let fullName = this.dataService.getProfileData().fullName;
    if (fullName === '') {
      this.greeting['msg'] = 'Welcome. You are a new user. Please click on Profile Section and update your records.'
    }
    else {
      this.greeting['msg'] = 'London is the most populous city in the United Kingdom, with a metropolitan area of over 9 million inhabitants.';
    }
    this.greeting['name'] = `Hello  ${fullName}`;

  }

}
