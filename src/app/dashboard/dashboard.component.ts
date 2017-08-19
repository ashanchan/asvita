import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  private profileData: any;
  private greeting: string;
  //=======================================
  //=======================================
  constructor(private dataService: DataService) { }
  //=======================================
  //=======================================
  public ngOnInit() {
    this.profileData = this.dataService.getProfileData();
    this.greeting = `Hello  ${this.profileData.fullName}`;
  }

}
