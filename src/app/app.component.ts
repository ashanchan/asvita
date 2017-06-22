import { Component } from '@angular/core';
import { ParserService } from './service/parser.service';
import { DataService } from './service/data.service';
import { parseString } from 'xml2js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})

export class AppComponent {
  private isDataLoaded = true;

  constructor(private parserService: ParserService, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.parserService.fetchData().subscribe(
      (response: Response) => {
        parseString(response, { trim: true }, (err, result) => {
          this.dataService.setSectionData(result);
          this.isDataLoaded = true;
          this.router.navigate(['./login']);
          this.router.navigate(['./login']);
        })
      }
    );
  }
}
