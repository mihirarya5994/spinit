import { Component, OnInit } from '@angular/core';

import { AppService } from './../../core/services/app.service';
import { RestService } from './../../core/services/rest.service';

@Component({
  selector: 'bb-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: any = { daily: [], weekly: [] };
  currentUser: any = {};
  tabs: any[] = [
    { id: 'daily', title: 'Daily', data: null },
    { id: 'weekly', title: 'Weekly', data: null }
  ];
  currentTab;
  fetching = false;

  constructor(
    private appService: AppService,
    private restService: RestService
  ) {  }

  ngOnInit() {
    this.setTab(this.tabs[1]);
  }

  setTab(tab) {
    if (this.fetching) {
      return;
    }
    this.currentTab = tab;
    if (!this.currentTab.data) {
      this.fetching = true;
      const apiSuffix = this.currentTab.id === 'daily' ? 'leaderboard' : 'weekleaderboard'; // seasonleaderboard
      this.restService
        .get(this.appService.getConfigParam('API_HOST') + '/' + apiSuffix)
        .subscribe(res => {
          tab.data = res.results || [];
          this.fetching = false;
        }, err => this.fetching = false);
    }
  }
}
