import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';

import { AppService } from './app.service';
import { RestService } from './rest.service';
import { EventEmitterService } from './event-emitter.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private appService: AppService,
    private restService: RestService,
    private eventEmitterService: EventEmitterService
  ) { }

  getProfile() {
    return this.restService
      .get(this.appService.getConfigParam('API_HOST') + '/my_profile')
      .pipe(
        tap(profile => {
          this.appService.setUserProfile(profile);
          this.eventEmitterService.emit({ type: 'PROFILE', data: profile });
        })
      );
  }

  getProfileSync() {
    return this.appService.getUserProfile();
  }

  updateProfile(settings) {
    return this.restService
      .put(this.appService.getConfigParam('API_HOST') + '/my_profile', settings)
      .pipe(
        tap(res => {
          this.appService.setUserProfile(settings);
        })
      );
  }
}
