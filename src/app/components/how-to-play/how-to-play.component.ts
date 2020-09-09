import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { EventEmitterService } from './../../core/services/event-emitter.service';
import { ExternalInterfaceService } from '../../core/services/external-interface.service';
import { AppService } from 'src/app/core/services/app.service';
import { RestService } from 'src/app/core/services/rest.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { TrackerService } from 'src/app/core/services/tracker.service';


declare const atag: any;

@Component({
  selector: 'bb-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.scss']
})
export class HowToPlayComponent implements OnInit {
  status;
  congratsText;
  congratsText2;
  lost = false;
  won = false;
  complete = false;
  date;
  thanks;
  wheelID;

  apps = [
]
  prize;
  loading = true;
  pagename;
  profile: {};
  digitalData;
  os;

  adComponentId;

  @ViewChild('ad', {static : false}) adElement: ElementRef;

  constructor(
    private eventEmitterService: EventEmitterService,
    private appService: AppService,
    private restService: RestService,
    private profileService: ProfileService,
    private externalInterfaceService: ExternalInterfaceService,
    private trackerService: TrackerService
  ) {

    this.profile = this.profileService.getProfileSync();

    let customerId;
    if (this.appService.getUserInfo().info && this.appService.getUserInfo().info.customerId) {
       customerId = this.appService.getUserInfo().info.customerId;
    } else {
       customerId = '';
    }
    this.digitalData = {
      page: {
        pageName: 'STW Thank You Page',
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
    this.trackerService.trackGAPages('STW Thank You Page');

   }

  ngOnInit() {
    this.wheelID = this.appService.wheelID;
    this.os= this.appService.getOS();
    this.date = this.appService.date;
    console.log(this.os);
    this.loading = false;
    this.adsInit();
    this.thanks = this.appService.thanks;

    this.getApps();

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

    this.trackerService.trackGALink('Spin the Wheel', 'Continue to JioEngage', 'STW Thank You Page', '');
  }

  adsInit(){
    setTimeout(() => {
      this.adComponentId = 'ad_' + Date.now();
      this.adElement.nativeElement.setAttribute('id', this.adComponentId);      
    }, 1500);
  }


  gotogame(game, i){
    let appNo = i + 1;
    const info = this.appService.getUserInfo();
    if(this.os=='android'){
      this.externalInterfaceService.launchBrowser(game.redirectUrl);
    } else if (this.os=='ios'){
      console.log(game.redirectUrl+'?FC=jioengage');
      this.externalInterfaceService.launchBrowser('my'+game.redirectUrl+'?FC=jioengage');
    }
    const digitalData = {
      ink: {
        linkName: 'STW_'+game.desc,
        linkPosition : 'Middle',
        linkType: 'STW_OtherPrograms'
      }
    }; atag(digitalData);

    this.trackerService.trackGALink('Spin the Wheel', game.index + '_' +game.desc , 'STW Thank You Page', '');

  }


}

