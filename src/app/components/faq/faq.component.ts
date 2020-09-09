import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { EventEmitterService } from './../../core/services/event-emitter.service';
import { ExternalInterfaceService } from '../../core/services/external-interface.service';
import { AppService } from 'src/app/core/services/app.service';
import { RestService } from 'src/app/core/services/rest.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { Router } from '@angular/router';
import { TrackerService } from 'src/app/core/services/tracker.service';


declare const atag: any;

@Component({
  selector: 'bb-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  status;
  congratsText;
  congratsText2;
  lost = false;
  won = false;
  complete = false;

  apps = [];
  prize;
  loading = true;
  pagename;
  profile: {};
  digitalData;
  os;
  dd;
  sup;
  mon;
  wheelID;

  adComponentId;

  @ViewChild('ad', {static : false}) adElement: ElementRef;

  constructor(
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private appService: AppService,
    private restService: RestService,
    private profileService: ProfileService,
    private externalInterfaceService: ExternalInterfaceService,
    private trackerService: TrackerService
  ) {
    this.status = window.location.pathname.split(';')[1].split('=')[1];
    if(this.status === 'winner') {
      this.prize = this.appService.prize;
      this.dd = this.appService.dd;
      this.sup = this.appService.sup;
      this.mon = this.appService.mon;
      this.pagename = 'STW Congratulations Page'
    } else if ( this.status === 'lost') {
      this.pagename = 'STW Better Luck Next Time Page'
    } else {
      this.pagename = 'STW Thank You page'
    }

    this.profile = this.profileService.getProfileSync();

    let customerId;
    if (this.appService.getUserInfo().info && this.appService.getUserInfo().info.customerId) {
       customerId = this.appService.getUserInfo().info.customerId;
    } else {
       customerId = '';
    }
    this.digitalData = {
      page: {
        pageName: this.pagename,
        pageInfo:
        {
          appName: 'Daily_Stream'
        }
      },
      user: {
        bpid: customerId,
      }
    };
    atag(this.digitalData);
    this.trackerService.trackGAPages(this.pagename);

   }

  ngOnInit() {

    this.adsInit();
    this.wheelID = this.appService.wheelID;
  
    this.os= this.appService.getOS();
    if(this.status === 'lost') {
      this.loading = false;
      this.eventEmitterService
      .emit({
        type: 'LOST_SCREEN',
        data: null
      });
      this.lost = true;
      this.congratsText = this.appService.better;
      this.congratsText2 = 'DONT WORRY';

      setTimeout(()=>{
        this.router.navigate(['/bb/how-to-play'])
      },6000)
    } else if(this.status === 'winner') {
      this.loading = false;
      this.eventEmitterService
      .emit({
        type: 'WON_SCREEN',
        data: null
      });
      this.won = true;
      this.congratsText = this.appService.congrats;
      this.congratsText2 = 'YOU CAN WIN'
      setTimeout(()=>{
        this.router.navigate(['/bb/how-to-play'])
      },6000)
    }

    this.getApps();

  }


  gotoengage() {

    if(this.os=='android'){
      this.externalInterfaceService.launchBrowser('jio://com.jio.myjio/jio_engage_dashboard');
    } else if (this.os=='ios'){
      this.externalInterfaceService.launchBrowser('myjio://com.jio.myjio/jio_engage?FC=jioengage');
    }
    // this.externalInterfaceService.close();
    const digitalData = {
      ink: {
        linkName: 'STW_ContinueToEngage',
        linkPosition : 'Middle',
        linkType: 'STW_OtherPrograms'
      }
    }; atag(digitalData);
    this.trackerService.trackGALink('Spin the Wheel', 'Continue to JioEngage', this.pagename, '');
  }

  adsInit(){
    setTimeout(() => {
      this.adComponentId = 'ad_' + Date.now();
      this.adElement.nativeElement.setAttribute('id', this.adComponentId);      
    }, 1500);
  }

  getApps() {
    this.restService
    .get(this.appService.getConfigParam('API_HOST_GAME') + '/app/activity/spin2win/recommend/'
    +this.wheelID)
    .subscribe(res=>{
      this.apps = res.activities[0].promos;
      console.log(this.apps);
    });
  }
  gotogame(game, i){
    let appNo = i + 1;



    const info = this.appService.getUserInfo();

    if(this.os=='android'){
      this.externalInterfaceService.launchBrowser(game.redirectUrl);
    } else if (this.os=='ios'){
      this.externalInterfaceService.launchBrowser('my'+game.redirectUrl+'?FC=jioengage');
    }
    const digitalData = {
      ink: {
        linkName: 'STW_'+game.name,
        linkPosition : 'Middle',
        linkType: 'STW_OtherPrograms'
      }
    }; atag(digitalData);
    this.trackerService.trackGALink('Spin the Wheel', game.index + '_' +game.desc , 'STW Thank You Page', '');

  }



}
