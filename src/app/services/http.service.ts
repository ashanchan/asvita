import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, Request } from '@angular/http';
import { DataService } from './../services/data.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpService {

  constructor(public http: Http, public dataService: DataService) { }

  public handleError(error: Response) {
    console.error(error);
    return 'Server Error ' + error;
  }

  public searchEntries(term) {
    return this.http
      .get('https://api.cdnjs.com/libraries?search=' + term)
      .map(res => res.json())
      .catch(this.handleError);
  }
  public getApiData(url, data, validation) {
    let headers = new Headers();
    // let token = this.dataService.getToken();
    // let sToken = token === '' ? '@$V!TA-#~ANMACH' : String(token);
    // headers.append('x-access-token', '@$V!TA-#~ANMACH');

    headers.append('x-access-token', '@$V!TA-#~ANMACH');
    if (validation) {
      //  headers.append('Authorization', 'Bearer ' + this.dataService.getToken());
    }


    console.log(this.dataService.getToken());
    let requestOptions = new RequestOptions({
      method: 'post',
      url: url,
      headers: headers,
      body: JSON.stringify(data)
    })

    return this.http.request(new Request(requestOptions))
      .map((res: Response) => res.json())
      .catch(this.handleError);
  }
}
