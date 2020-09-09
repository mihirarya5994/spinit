import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

declare const atag: any;

import { AppService } from './../../core/services/app.service';
import { RestService } from './../../core/services/rest.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'bb-profile-prize',
  templateUrl: './profile-prize.component.html',
  styleUrls: ['./profile-prize.component.scss']
})
export class ProfilePrizeComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();

  profilePrize: any = null;
  profile;
  show = false;

  constructor(
    private appService: AppService,
    private restService: RestService,
    private router: Router,
    private profileService: ProfileService
  ) { 
    this.profile = this.profileService.getProfileSync();
    let customerId;
    if (this.appService.getUserInfo().info && this.appService.getUserInfo().info.customerId) {
      customerId = this.appService.getUserInfo().info.customerId;
    } else {
      customerId = '';
    }
    // var digitalData = {
    //   page: {
    //     pageName: 'Profile Prize Screen',
    //     pageInfo:
    //         {
    //         appName:'AsianPaint Campaign'
    //         }
    //   },
     
    //     user: {
    //       bpid: customerId,
    //       name: this.profile.name,
    //       ageGroup: this.profile.ageGroup,
    //       state: this.profile.state,
    //       gender: this.profile.gender
    //     }
      
    // };
    // atag(digitalData);
  }

  ngOnInit() {
    this.restService
      .get(this.appService.getConfigParam('API_HOST') + 'wheelapi/my_profile')
      .subscribe(profile => {
        if (profile.notify) {
          this.profile = this.appService.getUserProfile();
          const allPrizesAndBanners = this.appService.getAllPrizesAndBanners();
          if (allPrizesAndBanners) {
            this.profilePrize = allPrizesAndBanners.profilePrize;
            this.show = true;
          } else {
            this.restService
              .get('assets/config/prizes.json')
              .subscribe(res => {
                this.appService.setAllPrizesAndBanners(res);
                this.profilePrize = res.profilePrize;
                this.show = true;
              });
          }
        }
      });
  }

  navigateToMyWinnings() {
    this.router.navigate(['/bb/prizes'], { queryParams: { type : 'winnings' }});
  }

  hide() {
    this.show = false;
  }
}
