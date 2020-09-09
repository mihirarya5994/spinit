import { Component, OnInit } from '@angular/core';

import * as AOS from 'aos';

import { AppService } from './core/services/app.service';
import { RestService } from './core/services/rest.service';
import { LoggerService } from './core/services/logger.service';
import { ExternalInterfaceService } from './core/services/external-interface.service';

@Component({
  selector: 'bb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private appService: AppService,
    private restService: RestService,
    private logger: LoggerService,
    private externalInterfaceService: ExternalInterfaceService
  ) {  }

  ngOnInit() {
    AOS.init({
      duration: 400, // values from 0 to 3000, with step 50ms
      easing: 'ease', // default easing for AOS animations
    });
    this.logger.setLogging(this.appService.getConfigParam('LOGS_ENABLED'));
    this.externalInterfaceService.sendLoadComplete();
    this.getServerTime();
    this.externalInterfaceService.sendNativeBackControl(false);
  }

  getServerTime() {
    this.restService
      .get(this.appService.getConfigParam('API_HOST') + '/sync_time')
      .subscribe((res: any) => {
        let offset: any = +new Date(res[0]) - +new Date();
        offset = offset || 0;
        this.appService.setCurrentTimeOffset(offset);
      });
  }
}
