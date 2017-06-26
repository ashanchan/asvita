import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { ParserService } from '../../service/parser.service';
import { DataService } from '../../service/data.service';

class Signup {
  constructor(
    public email: string = '',
    public password: string = ''
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
  private mode: string = 'login';

  @ViewChild('loginForm') form: any;

  constructor(private dataService: DataService) { }
  ngOnInit() {}

  changeMode(mode: string) {
    this.mode = mode;
  }
  onSubmit() {
    if (this.form.valid) {
      console.log("Form Submitted!");
      this.form.reset();
      this.dataService.setAuthentication(true);
    }
  }

}
