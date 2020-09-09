import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { AppService } from '../services/app.service';
import { RestService } from './../services/rest.service';
import { LoggerService } from './../services/logger.service';
import { ExternalInterfaceService } from './../services/external-interface.service';
import { ProfileService } from '../services/profile.service';

@Injectable()
export class AuthGuard implements CanActivate {
  isLoggedIn = false;
  isDirectPlay = null;
  digitalData;

  constructor(
    private router: Router,
    private appService: AppService,
    private profileService: ProfileService,
    private restService: RestService,
    private logger: LoggerService,
    private externalInterfaceService: ExternalInterfaceService
  ) {
       // Atags
       this.digitalData = {
        utmSource: this.getParameterByName('utm_source'),
        utmMedium: this.getParameterByName('utm_medium'),
        utmCampaign: this.getParameterByName('utm_campaign'),
        utmContent: this.getParameterByName('utm_content'),
        utmTerm: this.getParameterByName('utm_term')
      };
      localStorage.setItem('digitalData', JSON.stringify(this.digitalData));
      // console.log('UTM tags -', this.digitalData);
   }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLoggedIn) {
      return true;
    }
    this.isDirectPlay = this.getParameterByName('directPlay');
    this.appService.setHostApp(this.getParameterByName('host'));
    const jwtFromRoute = this.getParameterByName('jwt');
    const userInfo = this.appService.getUserInfo();
    if (jwtFromRoute && jwtFromRoute !== 'null') {
      return this.validateJWT(jwtFromRoute);
    } else if (userInfo.jwt) {
      return this.validateJWT(userInfo.jwt);
    }
    this.externalInterfaceService.requestJWT();
    this.logger.log('requesting jwt from native');
    return false;
  }

  public validateJWT(jwt) {
    // return true;
    if (this.isLoggedIn) {
      return true;
    }
    return new Observable<boolean>((observer) => {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', jwt);
      this.restService
        .post(this.appService.getConfigParam('API_HOST') + '/login', null, { headers: headers })
        .subscribe((res: any) => {
          const parsed = this.parseJWT(jwt);
          this.isLoggedIn = true;
          this.appService.setUserInfo({ jwt: jwt, info: parsed, token: res.token });
          this.profileService.getProfile().subscribe(profile => {
            this.logger.log('from auth');
          });
          // alert('from ag');
          observer.next(true);
          observer.complete();
        }, err => {
          this.isLoggedIn = false;
          this.externalInterfaceService.requestJWT();
          observer.next(false);
          observer.complete();
        });
    });

    // return this.restService
    // .post(this.appService.getConfigParam('API_HOST') + '/login', null, { headers: headers })
    // .subscribe((res: any) => {
    //   const parsed = this.parseJWT(jwt);
    //   this.isLoggedIn = true;
    //   this.appService.setUserInfo({ jwt: jwt, info: parsed, token: res.token });
    //   if (this.isDirectPlay !== 'true') {
    //     // this.router.navigate(['/']);
    //   } else {
    //     // this.router.navigate(['/bb']);
    //   }
    //   return true;
    // }, err => {
    //   this.isLoggedIn = false;
    //   this.externalInterfaceService.requestJWT();
    //   return false;
    // });
  }

  public getParameterByName(name, url?) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  public parseJWT (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
}
