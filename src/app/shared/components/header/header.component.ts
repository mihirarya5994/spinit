import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { AppService } from '../../../core/services/app.service';
import { RestService } from '../../../core/services/rest.service';
import { EventEmitterService } from '../../../core/services/event-emitter.service';
import { ExternalInterfaceService } from '../../../core/services/external-interface.service';
import {
  DataService,
  IDataUpdate,
  VALUE_TYPES
} from '../../../core/services/data.service';

@Component({
  selector: 'bb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() showParticipantsCount = false;
  @Input() showBack = true;

  participantsCount = 0;
  myPoints = 0;
  backTo = null;
  showback = true;
  os;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private restService: RestService,
    private dataService: DataService,
    private eventEmitterService: EventEmitterService,
    private externalInterfaceService: ExternalInterfaceService
  ) {}

  ngOnInit() {
    this.os= this.appService.getOS();
    this.router.events.subscribe(event => {
      if(this.router.url.includes('faq') || this.router.url.includes('how-to-play')){
        this.showback = false;
      } else {
        this.showback = true;
      }
      if (event instanceof NavigationEnd) {
        this.backTo = this.activatedRoute.snapshot.firstChild.data.backTo;
        if (event.url.indexOf('/bb/') > -1) {
          this.showParticipantsCount = true;
        }
        this.updateParticipantsCount();
      }
    });

    this.eventEmitterService.subscribe(event => {
      if (event.type === 'PROFILE') {
        this.myPoints = event.data.points;
      }
    });

    this.dataService.getUpdatesSubject().subscribe((update: IDataUpdate) => {
      if (update.type === VALUE_TYPES.MY_POINTS) {
        this.myPoints = +this.myPoints;
        this.myPoints += +update.value;
      } else if (update.type === VALUE_TYPES.PARTICIPANTS_COUNT) {
        this.participantsCount += update.value;
      }
    });
  }

  updateParticipantsCount() {
    // this.restService
    //   .get(this.appService.getConfigParam('API_HOST') + '/participantcount')
    //   .subscribe(res => {
    //     this.participantsCount = res.user_count;
    //   });
  }

  showSettings() {
    this.router.navigate(['/bb/history']);
  }

  back() {
    if (this.backTo) {
      this.router.navigate([this.backTo]);
    } else {
      if(this.os=='android'){
        this.externalInterfaceService.launchBrowser('jio://com.jio.myjio/enage_funzone');
      } else if (this.os=='ios'){
        this.externalInterfaceService.close();
      }
    }
  }
}
