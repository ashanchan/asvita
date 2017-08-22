import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-center-panel',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.css']
})
export class CenterPanelComponent implements OnInit {
  private isAuthenticated: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}
