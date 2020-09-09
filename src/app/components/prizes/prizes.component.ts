import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as Flickity from 'flickity';

import { AppService } from '../../core/services/app.service';
import { RestService } from '../../core/services/rest.service';
import { ExternalInterfaceService } from './../../core/services/external-interface.service';

@Component({
  selector: 'bb-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.scss']
})
export class PrizesComponent implements OnInit {
  @ViewChild('slider1', { static: false }) slider1Ele: ElementRef;
  @ViewChild('slider2', { static: false }) slider2Ele: ElementRef;
  @ViewChild('slider3', { static: false }) slider3Ele: ElementRef;
  @ViewChild('slider4', { static: false }) slider4Ele: ElementRef;
  @ViewChild('slider5', { static: false }) slider5Ele: ElementRef;
  @ViewChild('slider6', { static: false }) slider6Ele: ElementRef;

  tabs = [
    { id: 1, title: 'Prizes', active: false },
    { id: 2, title: 'My Winnings', active: false }
  ];
  activeTab = this.tabs[0];
  prizeList: any = {};
  winnings: any = {};
  slider1;
  slider2;
  slider3;
  slider4;
  slider5;
  slider6;
  deepLinkUrl;

  constructor(
    private appService: AppService,
    private restService: RestService,
    private externalInterfaceService: ExternalInterfaceService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.restService
      .get('assets/config/prizes.json')
      .subscribe(res => {
        this.appService.setAllPrizesAndBanners(res);
        this.prizeList = res.prizes;
        this.fetchMyWinnings();
      });

    this.deepLinkUrl = this.appService.getConfigParam(
      this.appService.getOS() === 'ios' ? 'MY_WINNINGS_IOS_LINK' : 'MY_WINNINGS_ANDROID_LINK'
    );

    this.activatedRoute
      .queryParams
      .subscribe(params => {
        if (params.type === 'winnings') {
          this.setTab(this.tabs[1]);
        } else if (params.type === 'prizes') {
          this.setTab(this.tabs[0]);
        }
      });
  }

  fetchMyWinnings() {
    this.restService
      .get(this.appService.getConfigParam('API_HOST') + '/myprizes')
      .subscribe(res => {
        this.winnings = res.prizes || {};
        Object.keys(this.winnings)
          .forEach(key => {
            this.winnings[key] = (this.winnings[key] || []).map(p => {
              return this.prizeList[key].filter(i => i.id === p.pId)[0];
            });
          });

        this.setupSliders();
      });
  }

  setTab(tab) {
    this.activeTab = tab;
  }

  setupSliders() {
    this.slider1 = new Flickity(this.slider1Ele.nativeElement, {
      prevNextButtons: false,
      contain: true,
      pageDots: false,
      cellAlign: 0
    });

    this.slider2 = new Flickity(this.slider2Ele.nativeElement, {
      prevNextButtons: false,
      contain: true,
      pageDots: false,
      cellAlign: 0
    });

    this.slider3 = new Flickity(this.slider3Ele.nativeElement, {
      prevNextButtons: false,
      contain: true,
      pageDots: false,
      cellAlign: 0
    });

    if (this.slider4Ele) {
      this.slider4 = new Flickity(this.slider4Ele.nativeElement, {
        prevNextButtons: false,
        contain: true,
        pageDots: false,
        cellAlign: 0
      });
    }

    if (this.slider5Ele) {
      this.slider5 = new Flickity(this.slider5Ele.nativeElement, {
        prevNextButtons: false,
        contain: true,
        pageDots: false,
        cellAlign: 0
      });
    }

    if (this.slider6Ele) {
      this.slider6 = new Flickity(this.slider6Ele.nativeElement, {
        prevNextButtons: false,
        contain: true,
        pageDots: false,
        cellAlign: 0
      });
    }
  }

  showVouchersInNativeClient() {
    this.externalInterfaceService.launchBrowser(this.deepLinkUrl);
  }
}
