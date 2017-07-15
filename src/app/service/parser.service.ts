import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, Request } from '@angular/http';

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
    return 'Server Error ' + error;
  }

  public getApiData(url, data) {
    let headers = new Headers();
    headers.append('x-access-token', '@$V!TA-#~ANMACH');
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

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

}
