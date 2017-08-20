import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data.service';
import { MessageService } from './../services/message.service';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})

export class LogoutComponent implements OnInit {
  private greeting: string;
  constructor(private dataService: DataService, private messageService: MessageService) { }
  //=======================================
  //=======================================
  public ngOnInit() {
    let profileData = this.dataService.getProfileData();
    this.greeting = `Bye bye  ${profileData.fullName}.`;
    this.dataService.setDiskSpace(null);
    this.dataService.setProfileData(null);
    this.dataService.setToken(null);
    this.dataService.setUserId(null);
    this.messageService.sendMessage({ event: 'onLogout', component: 'onLogout', success: true });
  }

}
