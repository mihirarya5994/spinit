import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AppService } from './app.service';

@Injectable()
export class RestService {

  constructor(
    private httpClient: HttpClient,
    private appService: AppService
  ) {  }

  get(url): Observable<any> {
    let headers = new HttpHeaders();
    headers = this.appendAuthorizationHeader(headers);
    return this.httpClient.get(url, { headers: headers });
  }

  post(url: string, body: any | null, options: any = {}) {
    let headers: HttpHeaders = options.headers || new HttpHeaders();
    headers = this.appendAuthorizationHeader(headers);
    return this.httpClient.post(url, body, { headers: headers });
  }

  put(url: string, body: any | null, options: any = {}) {
    let headers: HttpHeaders = options.headers || new HttpHeaders();
    headers = this.appendAuthorizationHeader(headers);
    return this.httpClient.put(url, body, { headers: headers });
  }

  delete(url: string, options: any = {}) {
    let headers: HttpHeaders = options.headers || new HttpHeaders();
    headers = this.appendAuthorizationHeader(headers);
    return this.httpClient.delete(url, { headers: headers });
  }

  appendAuthorizationHeader(headers: HttpHeaders): HttpHeaders {
    const sId = this.appService.getUserInfo().jwt;
    if (sId) {
      headers = headers.set('Authorization', sId);
    }
    return headers;
  }

  private checkAndHandleError(res) {
    if (res.success === false) {
      console.error(res.description, 'Error', { timeout: 3000 });
    }
  }
}
