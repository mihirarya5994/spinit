import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

import { AppService } from './app.service';
import { EventEmitterService } from './../../core/services/event-emitter.service';
import { LoggerService } from './logger.service';

declare const window: any;
declare const webkit: any;

@Injectable({
  providedIn: 'root'
})
export class ExternalInterfaceService {
  public subject$: Subject<any> = new Subject();

  constructor(
    private zone: NgZone,
    private router: Router,
    private appService: AppService,
    private logger: LoggerService,
    private eventEmitterService : EventEmitterService
  ) {
    this.setupCallbacksFromNative();
  }

  share(data) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'share',
          desc: data
        })
      )
    );
  }

  playSound(audioObj) {
    this.stopSound();
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'playinternalsound',
          path: audioObj.path || null,
          loop: audioObj.loop || false,
          name: audioObj.name || null
        })
      )
    );
  }

  stopSound() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'stopsound'
        })
      )
    );
  }

  launchBrowser(url) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'launchbrowser',
          value: url
        })
      )
    );
  }

  playJioCinemaVideo(url) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'playJioCinemaVideo',
          value: url
        })
      )
    );
  }

  sendLoadComplete() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'loadingCompleted'
        })
      )
    );
  }

  close() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'close'
        })
      )
    );
  }

  requestJWT() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'jwt'
        })
      )
    );
  }

  requestVideoCapture() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'video'
        })
      )
    );
  }

  private externalCall(data) {
    try {
      if (window.android && window.android.__externalCall) {
        window.android.__externalCall(data);
      }
      if (window.__externalCall) {
        window.__externalCall(data);
      }
      webkit.messageHandlers.callback.postMessage(data);
    } catch (e) {
      this.logger.error('external call failed');
    }
  }

  requestAdParams() {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: "adparams"
        })
      )
    );
  }

  public setupCallbacksFromNative() {
    window.sendJwt = jwt => {
      this.zone.run(() => {
        this.appService.setUserInfo({ jwt: jwt });
        this.router.navigate(['/']);
      });
    };
    window.sendCapturedVideoFromCamera = config => {
      alert('sendCapturedVideoFromCamera called with ' + JSON.stringify(config));
    };
    window.sendAdParams = (params) => {
      // params will have latitude, longitude, Adid, OS
      console.log('Params from sendAdParams for Adid' + JSON.stringify(params));
      let userIfa = '';
      let lat, long;
      if (this.appService.getOS() === 'ios') {
        userIfa = JSON.parse(params).Adid;
        lat = JSON.parse(params).latitude;
        long = JSON.parse(params).longitude;
      } else {
        userIfa = params.Adid;
        lat = params.latitude;
        long = params.longitude;
      }
      window.AD_USER = {
        userIfa: userIfa,
        city: ''
      };
      window.AD_INFO = {
        lat: lat,
        lng: long
      };
      console.log('Adid passed to JioAds ' + JSON.stringify(window.AD_USER));
      this.eventEmitterService.emit({
        type: 'AD_PARAMS',
        data: JSON.parse(params)
      });
    };

    window.ADSDKEXT = {};
    window.ADSDKEXT.click_handler = (url) => this.launchBrowser(url);
    window.handleBackKey =() => {
      var os = this.appService.getOS();
      if (os == 'android') {
        this.launchBrowser('jio://com.jio.myjio/enage_funzone');
      } else if (os == 'ios') {
        this.close();
      }
  
    }
  }

  sendNativeBackControl(data) {
    this.externalCall(
      btoa(
        JSON.stringify({
          type: 'handleWebviewBack',
          value: data
        })
      )
    );
  }

}
