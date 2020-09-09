import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

declare const atag: any;

import { RestService } from '../../core/services/rest.service';
import { DataService, VALUE_TYPES } from '../../core/services/data.service';
import { AppService } from '../../core/services/app.service';
import { ExternalInterfaceService } from 'src/app/core/services/external-interface.service';
import { LoggerService } from './../../core/services/logger.service';

import { STATES_LIST, GENDERS, AGE_GROUPS } from '../../app.constants';
import { ProfileService } from 'src/app/core/services/profile.service';
import { AstMemoryEfficientTransformer } from '@angular/compiler';

@Component({
  selector: 'bb-profile-capture',
  templateUrl: './profile-capture.component.html',
  styleUrls: ['./profile-capture.component.scss']
})
export class ProfileCaptureComponent implements OnInit {
  profileForm: FormGroup;
  submitting = false;
  submitted = false;
  errors = {};
  genders = GENDERS;
  ageGroups = AGE_GROUPS;
  states = STATES_LIST;
  profile: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private appService: AppService,
    private restService: RestService,
    private profileService: ProfileService,
    private externalInterfaceService: ExternalInterfaceService
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
    //     pageName: 'Profile Capture Screen',
    //     pageInfo:{
    //       appName:'AsianPaint Campaign'
    //     }
    //   },
    //   user: {
    //     bpid: customerId,
    //     name: this.profile.name,
    //     ageGroup: this.profile.ageGroup,
    //     state: this.profile.state,
    //     gender: this.profile.gender
    //   }
    // };
    // atag(digitalData);
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.pattern(/^[a-zA-Z]+$/)
        ]
      ],
      ageGroup: ['', Validators.required],
      gender: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  submit() {
    if (this.submitting) {
      return;
    }
    this.submitted = true;
    if (this.profileForm.valid) {
      const formData = [
        {
          index: 1,
          payload: { field: 'name', answer: this.profileForm.get('name').value }
        },
        {
          index: 2,
          payload: {
            field: 'ageGroup',
            answer: this.profileForm.get('ageGroup').value
          }
        },
        {
          index: 3,
          payload: {
            field: 'gender',
            answer: this.profileForm.get('gender').value
          }
        },
        {
          index: 4,
          payload: {
            field: 'state',
            answer: this.profileForm.get('state').value,
            profileCompleted: true
          }
        }
      ];
      this.submitForm(formData);
    }
  }

  submitForm(formData) {
    if (formData.length) {
      this.submitOne(formData, formData.shift());

      // atag
      // var digitalData = {
      //   link:{
      //   linkName: 'Register Profile',
      //   linkPosition:'Body',
      //   linkType:'AsianPaint'
      //   },
      //   user:{
      //     name: this.profileForm.get('name').value,
      //     ageGroup: this.profileForm.get('ageGroup').value,
      //     state: this.profileForm.get('gender').value,
      //     gender: this.profileForm.get('state').value
      //   },
      //   }
      //   atag(digitalData);
      // atag ends
      this.router.navigate(['/bb']);
    } else {
      this.submitting = false;
      this.submitted = false;
      this.router.navigate(['/bb']);
    }
  }

  submitOne(formData, payload) {
    this.restService
      .post(
        this.appService.getConfigParam('API_HOST') +
          '/my_profile/answers/' +
          payload.index,
        payload.payload
      )
      .subscribe(res => {
        this.dataService.update(VALUE_TYPES.MY_POINTS, 10);
        this.submitForm(formData);
      });
  }

  close() {
    this.externalInterfaceService.close();
  }
}
