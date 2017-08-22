import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { MessageService } from './../services/message.service';
import { Subscription } from 'rxjs/Subscription';

class Signup {
  constructor(
    public email: string = '',
    public password: string = '',
    public oldPassword: string = '',
    public newPassword: string = '',
    public conPassword: string = '',
    public mode: string = '',
    public type: string = ''
  ) { }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})

export class LoginComponent implements OnInit, OnDestroy {
  private model: Signup = new Signup();
  private subscription: Subscription;
  private title: string = "Login";
  private emailTip: string = "Enter your registered Email";
  private alertTip: string = '';
  private formDisabled: boolean = false;
  @ViewChild('loginForm') form: any;

  constructor(private dataService: DataService, private messageService: MessageService) { }

  //=======================================
  //=======================================
  public ngOnInit() {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.onMessageReceived(message);
    });

    this.model.mode = 'login';
    this.model.email = 'ashanchan@yahoo.com';
    this.model.password = 'Ashtra123';
    this.model.type = "pat";
    this.title = "Login";
  }
  //=======================================
  //=======================================
  public ngOnDestroy(): void {
  }
  //=======================================
  //=======================================
  private changeMode(mode: string): void {
    this.alertTip = '';
    this.formDisabled = false;
    this.emailTip = "Enter Your Registered Email";
    this.model.mode = mode;
    this.model.password = '';
    this.model.oldPassword = '';
    this.model.newPassword = '';
    this.model.conPassword = '';
    if (mode === "login") this.title = "Login";
    if (mode === "fyp") this.title = "Forgot Your Password";
    if (mode === "register") {
      this.title = "Register";
      this.emailTip = "Enter Your Valid Email To Register";
    }

    if (mode === "reset") this.title = "Reset Your Password";
  }
  //=======================================
  //=======================================
  private chkValidation(): boolean {
    if (this.model.mode === 'reset') {
      if (this.model.newPassword === this.model.oldPassword) {
        this.alertTip = "New Password should not be same as Existing Password";
        return false;
      }
      if (this.model.newPassword !== this.model.conPassword) {
        this.alertTip = "New Password and Confirm Password must be same";
        return false;
      }
      this.model.password = this.model.oldPassword;
      return true;
    }
    return true;
  }
  //=======================================
  //=======================================
  private onSubmit(): void {
    this.alertTip = '';
    if (this.chkValidation() && this.form.valid) {
      this.messageService.sendMessage({ event: 'onLoginSubmit', component: 'login', data: { mode: this.model.mode, model: this.model } });
    }
  }
  //=======================================
  //=======================================
  private onMessageReceived(message: any): void {
    if (message.event === 'onLoginProcessed') {
      if (message.isSuccess) {
        this.formDisabled = true;
      }
      this.alertTip = message.msg;
    }
  }
}
//=======================================
//=======================================
