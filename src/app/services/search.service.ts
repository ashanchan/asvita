import { Injectable } from '@angular/core';
import { HttpService } from './../services/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class SearchService {
  constructor(private httpService: HttpService) { }

  search(terms: Observable<string>) {
    return terms.debounceTime(100)
      .distinctUntilChanged()
      .switchMap(term => this.httpService.searchEntries(term));
  }
}
