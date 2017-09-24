import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WindowService } from './services/window.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private router: Router, private windowService: WindowService) { }

  ngOnInit() {
    this.windowService.setThemeStyle();
    this.router.navigate(['./login']);
  }

}
