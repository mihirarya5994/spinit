import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable } from 'rxjs';

import { AppService } from '../services/app.service';
import { RestService } from '../services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class EventResolver implements Resolve<any> {

  constructor(
    private appService: AppService,
    private restService: RestService
  ) {  }

  resolve(): Observable<any> {
    return this.restService.get(this.appService.getConfigParam('API_HOST') + '/events/current');
  }
}
