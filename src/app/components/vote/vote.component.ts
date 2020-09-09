import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { RestService } from '../../core/services/rest.service';
import { AppService } from '../../core/services/app.service';
import { ContestantService } from '../../core/services/contestant.service';
import { CountdownService } from '../../core/services/countdown.service';
import { EventEmitterService } from '../../core/services/event-emitter.service';
import { ProfileService } from '../../core/services/profile.service';
import { LoggerService } from '../../core/services/logger.service';

import { util } from './../../util';
import { QUESTION_TYPES } from '../../app.constants';
declare const atag: any;

@Component({
  selector: 'bb-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private restService: RestService,
    private contestantService: ContestantService,
    private countdownService: CountdownService,
    private eventEmitterService: EventEmitterService,
    private profileService: ProfileService,
    private logger: LoggerService
  ) {

    // let customerId;
    // if (this.appService.getUserInfo().info && this.appService.getUserInfo().info.customerId) {
    //   customerId = this.appService.getUserInfo().info.customerId;
    // } else {
    //   customerId = '';
    // }
    // const digitalData = {
    //   page: {
    //     pageName: 'JioSaavn Congratulaions',
    //     pageInfo:
    //       {
    //       appName:'JioSaavn'
    //         }
    //     },
    //   user: {
    //     bpid: customerId,
    //     name: this.profile.name,
    //     ageGroup: this.profile.ageGroup,
    //     state: this.profile.state,
    //     gender: this.profile.gender
    //}
    // };
    // atag(digitalData);
   }

  ngOnInit() {
   
  }

  spin() {
    var deg =  1860; // Math.floor(Math.random() * (x - y)) + y;
  
    document.getElementById('box').style.transform = "rotate("+deg+"deg)";
  
    var element = document.getElementById('mainbox');
    element.classList.remove('animate');
    setTimeout(function(){
      element.classList.add('animate');
    }, 5000); //5000 = 5 second
  }

 
}
