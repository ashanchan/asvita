import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  private copyright: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.copyright = '© copyright ' + new Date().getFullYear();
    this.router.navigate(['./login']);
  }

}
