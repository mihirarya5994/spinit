import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

declare const atag: any;

import { AppService } from '../../core/services/app.service';
import { RestService } from '../../core/services/rest.service';
import { ExternalInterfaceService } from '../../core/services/external-interface.service';
import { ProfileService } from '../../core/services/profile.service';
import { TrackerService } from 'src/app/core/services/tracker.service';

@Component({
  selector: 'bb-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
  initialProfile: any = {};
  profile;
  loading = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private restService: RestService,
    private externalInterfaceService: ExternalInterfaceService,
    private profileService: ProfileService,
    private trackerService: TrackerService
  ) {
    this.profile = this.profileService.getProfileSync();
    this.trackerService.trackGAPages("STW Splash Page Page");

    //     let customerId;
    //     if (this.appService.getUserInfo().info && this.appService.getUserInfo().info.customerId) {
    //       customerId = this.appService.getUserInfo().info.customerId;
    //     } else {
    //       customerId = '';
    //     }
    //     var digitalData = {
    //       page: {
    //         pageName: 'Splash Screen',
    //         pageInfo:{ appName:'AsianPaint Campaign' }
    //       }
    // },
    // user: {
    //   bpid: customerId,
    //   name: this.profile.name,
    //   ageGroup: this.profile.ageGroup,
    //   state: this.profile.state,
    //   gender: this.profile.gender
    // },
    //   };
    //   atag(digitalData);
    //  }
  }
  ngOnInit() {
    this.loading = false;
    // this.restService
    //   .post(this.appService.getConfigParam('API_HOST_GAME') + '/log',
    //     {
    //       "flag": "Splash",
    //       "sqID": "Splash"
    //     })
    //   .subscribe(res => {
    //   });


    setTimeout(() => {
      // console.log('in splash');
      this.router.navigate(['/bb']);
    }, 2000);

    // this.activatedRoute.queryParams.subscribe((params) => {
    //   if (params.jwt) {
    //     this.appService.setUserInfo({ jwt: params.jwt });
    //   }
    //   if (params.directplay === 'true') {
    //     this.router.navigate(['/schedule']);
    //   }
    // });
    // this.profileService
    //   .getProfile()
    //   .subscribe(res => {
    //     console.log(res);

    //     this.profile = res;
    //     this.initialProfile = JSON.parse(JSON.stringify(res));
    // this.initialProfile.profileCompleted = [true, 'true'].indexOf(this.initialProfile.profileCompleted) > -1;
    // this.initialProfile.TnC = [true, 'true'].indexOf(this.initialProfile.TnC) > -1;
    // this.profile.TnC = [true, 'true'].indexOf(this.profile.TnC) > -1;
    // // this.profile.TnC = true;
    //   console.log(this.initialProfile);
    //   if (this.initialProfile.TnC) {
    //     setTimeout(() => {
    //       this.play();
    //     }, 1500);
    //   }
    //   if (this.profile.TnC){
    //     setTimeout(() => {
    //       // this.play()
    //     }, 1500);
    //   }
    //   this.loading = false;
    // });
  }
  //   this.profileService
  //     .getProfile()
  //     .subscribe(res => {
  //       this.profile = res;
  //       this.initialProfile = JSON.parse(JSON.stringify(res));
  //       this.initialProfile.profileCompleted = [true, 'true'].indexOf(this.initialProfile.profileCompleted) > -1;
  //       this.initialProfile.TnC = [true, 'true'].indexOf(this.initialProfile.TnC) > -1;
  //       this.profile.TnC = [true, 'true'].indexOf(this.profile.TnC) > -1;
  //       //this.profile.TnC = true;
  //       if (this.initialProfile.profileCompleted && this.initialProfile.TnC) {
  //         setTimeout(() => {
  //           this.play();
  //         }, 2000);
  //       }
  //       this.loading = false;
  //     });
  // }

  // acceptTnC() {
  //   if (!this.profile.TnC) {
  //     this.profileService
  //       .updateProfile({ TnC: true })
  //       .subscribe(() => {
  //         this.profile.TnC = true;
  //       });
  //   }
  // }

  // navigateToTnC() {
  //   this.externalInterfaceService.launchBrowser(this.appService.getConfigParam('TNC_URL'));
  // }

  // play() {
  //   if (this.profile.TnC) {
  //     // gtag('event', 'Play_Now_New_User', {
  //     //   event_category: 'Andhadhun_Movie_Quiz',
  //     //   event_label: 'NA'
  //     // });
  //     if (this.profile.profileCompleted || this.profile.profileCompleted === 'true') {
  //       this.router.navigate(['/bb']);
  //     } else {
  //       this.router.navigate(['/bb/profile-capture']);
  //       var digitalData = {
  //         link:{
  //         linkName: 'Proceed',
  //         linkPosition:'Banner',
  //         linkType:'AsianPaint'
  //         }
  //         }
  //       atag(digitalData);
  //     }
  //   }
  // }

  close() {
    this.externalInterfaceService.close();
  }
}

