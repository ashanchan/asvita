import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SearchService } from './../services/search.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  @Input() idx: number;
  @Output() ratingClicked: EventEmitter<string> = new EventEmitter<string>();
  results: Object;
  searchTerm$: any = new Subject<string>();

  constructor(private searchService: SearchService) {
    this.searchService.search(this.searchTerm$)
      .subscribe(results => {
        this.results = results.results;
      });
  }

  ngOnInit() {
  }

  onSelected(val) {
    if (val) {
      let field: any = document.getElementsByClassName('medName')[this.idx];
      field.value = val;
    }
    this.results = null;
    document.getElementById("dummy").focus();
  }
}
