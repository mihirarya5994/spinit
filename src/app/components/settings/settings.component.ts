import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../core/services/app.service';
import { RestService } from '../../core/services/rest.service';
import { ExternalInterfaceService } from '../../core/services/external-interface.service';
import { ProfileService } from '../../core/services/profile.service';
import oreo from '../../../assets/config/oreo.json';

import { STATES_LIST, GENDERS, AGE_GROUPS } from '../../app.constants';

declare const atag;
@Component({
  selector: 'bb-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('nickname', {static : false}) nickname: ElementRef;

  settings: any = {};
  steps: any[] = [
    {
      id: 1,
      question: 'Nickname',
      field: 'name',
      isInputField: true
    }, {
      id: 2,
      question: 'Where are you from?',
      field: 'state',
      options: STATES_LIST
    }, {
      id: 3,
      question: 'What is your Gender?',
      field: 'gender',
      options: GENDERS
    }, {
      id: 4,
      question: 'What is your Age?',
      field: 'ageGroup',
      options: AGE_GROUPS
    }
  ];
  stepForEdit = null;
  submitting = false;
  error = null;
  // digitalData;
  profile;

  constructor(
    private router: Router,
    private appService: AppService,
    private restService: RestService,
    private externalInterfaceService: ExternalInterfaceService,
    private profileService: ProfileService
  ) {

    this.profile = this.profileService.getProfileSync();
    // console.log(this.profile);

    let customerId;
    if (this.appService.getUserInfo().info && this.appService.getUserInfo().info.customerId) {
      customerId = this.appService.getUserInfo().info.customerId;
    } else {
      customerId = '';
    }
  //   const digitalData = {
  //     page: {
  //       pageName: 'Settings Screen',
  //       pageInfo:
  //       {
  //         appName: 'AsianPaint Campaign'
  //       }
  //     },
  //     user: {
  //       bpid: customerId,
  //       name: this.profile.name,
  //       ageGroup: this.profile.ageGroup,
  //       state: this.profile.state,
  //       gender: this.profile.gender
  //     }
  //   };
  //   atag(digitalData);
   }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.profileService
      .getProfile()
      .subscribe(res => {
        Object.assign(this.settings, res);
      });
  }

  editProfile(id) {
    this.stepForEdit = this.steps.filter(s => s.id === id)[0];
  }

  saveStepAnswer(step, option) {
    step.options.forEach(o => o.selected = false);
    option.selected = true;
    this.stepForEdit = null;
    this.settings[step.field] = option.value;
  }

  changeSetting(type) {
    switch (type) {
      case 'sound':
        this.settings.sound = this.settings.sound === 'on' ? 'off' : 'on';
        break;
      case 'language':
        this.settings.language = this.settings.language === 'en' ? 'hi' : 'en';
        break;
    }
  }

  saveStep1Answer(step) {
    this.error = null;
    const value = this.nickname.nativeElement.value;
    if (!value || value.length > 8 || !/^[a-zA-Z]+$/.test(value)) {
      this.error = 'Please enter a valid nickname with upto 8 characters.';
      return;
    }
    this.stepForEdit = null;
    this.settings[step.field] = value;
    this.save(true);
  }

  save(stay?) {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.profileService
      .updateProfile(this.settings)
      .subscribe(res => {
        this.submitting = false;
        if (!stay) {
          this.router.navigate(['/bb']);
        }
      });

    // this.digitalData = {
    //   link: {
    //     linkName: 'Edit Profile',
    //     linkPosition: 'Body',
    //     linkType: 'AsianPaint'
    //   }
    // };
    // atag(this.digitalData);

  }



  invite() {
    this.externalInterfaceService.share(oreo.SHARE_MESSAGE);
  }

  navigate(type) {
    this.router.navigate([type]);
  }

  navigateToExternalUrl(type) {
    let url;
    switch (type) {
      case 'tnc':
        url = this.appService.getConfigParam('TNC_URL');
        break;
      case 'how-to-play':
        url = this.appService.getConfigParam('HOW_TO_PLAY_URL');
        break;
      case 'faq':
        url = this.appService.getConfigParam('FAQ_URL');
        break;
    }
    this.externalInterfaceService.launchBrowser(url);
  }

  close() {
    this.stepForEdit = null;
  }
}
