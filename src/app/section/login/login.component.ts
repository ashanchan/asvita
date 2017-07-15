import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { ParserService } from '../../service/parser.service';
import { DataService } from '../../service/data.service';

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
  @ViewChild('loginForm') form: any;

  constructor(private parserService: ParserService, private dataService: DataService, ) { }
  ngOnInit() {
    this.model.mode = 'login';
    this.model.type = 'pat';
    this.model.email = 'ashanchan@gmail.com';
  }

  changeMode(mode: string) {
    this.model.mode = mode;
  }

  chkValidation() {
    if (this.model.mode === 'reset') {
      return (this.model.newPassword !== this.model.oldPassword) && (this.model.newPassword === this.model.conPassword)
    }
    return true;
  }

  onSubmit() {
    if (this.chkValidation() && this.form.valid) {
      console.log('processing now');
      let mode = this.model.mode;
      let apiUrl = 'http://localhost:1616/login'
      this.parserService.getApiData(apiUrl, this.model).subscribe(
        (response: Response) => {
          this.onProcess(mode, response);
        }
      )
      this.form.reset();
      this.dataService.setAuthentication(true);
    }
  }


  onProcess(mode, response) {
    switch (mode) {
      case 'register':
        if (response.success) {
          this.disableMode = true;
          console.log('you will receive mail');
        }
        else {
          console.log('sorry user exists');
        }
        break;
    }
  }
}