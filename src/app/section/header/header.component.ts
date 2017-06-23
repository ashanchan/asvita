import { Component, EventEmitter, OnInit } from '@angular/core';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  outputs: ['onSectionChangeEvent']
})

export class HeaderComponent implements OnInit {
  private sectionData: object = {};
  private sectionTitle: string = '';
  private bgImage: string = '';
  private isDataLoaded: boolean = false;

  private tabId: number = 0;
  private onSectionChangeEvent = new EventEmitter<string>();

  constructor(private dataService: DataService) { }

  ngOnInit() {
    var interval = setInterval(() => {
      this.isDataLoaded = this.dataService.hasDataLoaded();
      if (this.isDataLoaded) {
        clearInterval(interval);
        this.sectionData = this.dataService.getSectionData('section');
        this.onTabClicked(0,'/login');
      }
    }, 250);
  }

  onButtonClicked() {
    //this.collapseMenu = !this.collapseMenu;
  }

  onTabClicked(id: number, section: string) {
    this.sectionTitle = this.sectionData['tab'][id]['col2'][0];
    this.bgImage = 'url(../../assets/media/img' + section + '/section.jpg)';
    this.tabId = id;
    window.scrollTo(0, 0);
    this.onSectionChangeEvent.emit(section);
    this.onButtonClicked();
  }

  getBgImage() {
    return this.bgImage;
  }
}
