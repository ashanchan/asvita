import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import '../../assets/lib/xml2json.min.js';

@Injectable()
export class ParserService {
  private headers = new Headers();
  private dataUrl: string = '../../assets/modal/dummys.xml';

  constructor(private http: Http) { 
    this.headers.append('Accept', 'application/xml');
  }

  public fetchData() {
    return this.http.get(this.dataUrl)
    .map( (response : Response) => response.json())
    .catch (this.handleError);
  }

  private handleError(error: Response) {
    console.error(error)
    return 'Server Error';
  }


}
