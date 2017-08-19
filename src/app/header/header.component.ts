import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private showTabs: boolean = false;
  //=======================================
  //=======================================
  constructor(private messageService: MessageService, private router: Router) { }
  //=======================================
  //=======================================
  ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onAuthentication(message);
    });
  }
  //=======================================
  //=======================================
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  //=======================================
  //=======================================
  onAuthentication(message: any): void {
    let component = message.component;
    switch (component) {
      case 'login':
        this.showTabs = true;
        this.router.navigate(['./image']);
        break;
    }
    console.log(message);
  }
}
