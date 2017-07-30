import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { ParserService } from '../../service/parser.service';
import { DataService } from '../../service/data.service';
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
  private disableMode: boolean = false;
  private title:String = "Login";
  private emailTip:String = "Enter your registered Email";
  @ViewChild('loginForm') form: any;

  constructor(private parserService: ParserService, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.model.mode = 'login';
    this.model.type = 'pat';
    this.model.email = 'ashanchan@gmail.com';
    this.title = "Login";
  }

  changeMode(mode: string) {
    this.emailTip = "Enter Your Registered Email";
    this.model.mode = mode;
    if(mode === "login") this.title = "Login";
    if(mode === "fyp") this.title = "Forgot Your Password";
    if(mode === "register") {
      this.title = "Register";
      this.emailTip = "Enter Your Valid Email To Register";
    }

    if(mode === "reset") this.title = "Reset Your Password";

  }

  chkValidation() {
    if (this.model.mode === 'reset') {
      return (this.model.newPassword !== this.model.oldPassword) && (this.model.newPassword === this.model.conPassword)
    }
    return true;
  }

  onSubmit() {
    if (this.chkValidation() && this.form.valid) {
      let mode = this.model.mode;
      let apiUrl = 'http://localhost:1616/login'
      this.parserService.getApiData(apiUrl, this.model, true).subscribe(
        (response: Response) => {
          this.onProcess(mode, response);
        }
      )
      this.form.reset();
    }
  }


  onProcess(mode, response) {
    switch (mode) {
      case 'login':
        if (response.success) {
          this.dataService.setToken(response.response.token);
          console.log(response.response.token);
          this.router.navigate(['./profile']);
        }
        break;
      case 'register':
        if (response.success) {
          this.disableMode = true;
          console.log('you will receive mail');
        }
        else {
          console.log('sorry user exists');
          this.router.navigate(['./profile']);
        }
        break;
    }
  }
}