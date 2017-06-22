import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';


@Injectable()
export class ParserService {
  private dataUrl: string = '../../assets/modal/data.xml';

  constructor(private http: Http) { }

  public fetchData() {
    return this.http.get(this.dataUrl)
      .map((response: Response) => response['_body'])
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error)
    return 'Server Error '+error;
  }

  public getApiData(url, data) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    console.log(data);
    return this.http.post('http://localhost:3000/login',data, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

}
