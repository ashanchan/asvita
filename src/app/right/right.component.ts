import { Component, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from './../services/data.service';

@Component({
  selector: 'app-right-panel',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.css']
})

export class RightPanelComponent implements OnInit {
  private profilePic: string = '../../assets/img/blank-user.jpg';
  private subscription: Subscription;
  private isAuthenticated: boolean = false;
  //=======================================
  //=======================================
  public constructor(private messageService: MessageService, private dataService: DataService) { }
  //=======================================
  //=======================================
  public ngOnInit(): void {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });
  }
  //=======================================
  //=======================================
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    setTimeout(() => {
      this.isAuthenticated = false;
    }, 500);
  }
  //=======================================
  //=======================================
  private onMessageReceived(message: any): void {
    switch (message.event) {
      case 'onProfileUpdate':
        this.isAuthenticated = true;
        break;
      case 'onLogout':
        this.ngOnDestroy();
        break;
    }
  }
  //=======================================
  //=======================================

}
