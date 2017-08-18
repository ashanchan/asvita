import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { DataService } from './../services/data.service';
import { HttpService } from './../services/http.service';
import { Router } from '@angular/router';

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

export class LoginComponent implements OnInit {
  private model: Signup = new Signup();
  private title: string = "Login";
  private emailTip: string = "Enter your registered Email";
  private alertTip: string = '';
  private formDisabled: boolean = false;
  @ViewChild('loginForm') form: any;

  constructor(private httpService: HttpService, private dataService: DataService, private router: Router) { }

  //=======================================
  //=======================================
  public ngOnInit() {
    this.model.mode = 'login';
    this.model.type = 'pat';
    this.model.email = 'ashanchan@yahoo.com';
    this.model.password = 'Ashtra123';
    this.title = "Login";
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
      let mode = this.model.mode;
      let apiUrl = 'http://localhost:1616/login'
      this.httpService.getApiData(apiUrl, this.model, true).subscribe(
        (response: Response) => {
          this.onProcess(mode, response);
        }
      )
    }
  }
  //=======================================
  //=======================================
  private onProcess(mode, response): void {
    switch (mode) {
      case 'login':
        if (response.success) {
          this.dataService.setToken(response.response.token);
          this.dataService.setUserId(response.response.userId);
          let url: string = this.dataService.getUserId().substr(0, 3);
          this.router.navigate(['./profile-' + url.toLowerCase()]);
          //this.router.navigate(['./image']);
        }
        break;
    }

    if (response.success) {
      this.formDisabled = true;
    }
    this.alertTip = response.response.msg;
  }
}
//=======================================
//=======================================
