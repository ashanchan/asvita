import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, Request } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';


@Injectable()
export class HttpService {

  constructor(private http: Http) { }

  private handleError(error: Response) {
    console.error(error);
    return 'Server Error ' + error;
  }

  public getApiData(url, data, validation) {
    let headers = new Headers();
    if (validation) {
      headers.append('x-access-token', '@$V!TA-#~ANMACH');
    }

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
