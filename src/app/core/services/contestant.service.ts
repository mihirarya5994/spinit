import { Injectable } from '@angular/core';

import { AppService } from './app.service';

import { CONTESTANTS, DEFAULT_CONTESTANT } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class ContestantService {
  private currentEvent: any = {};

  constructor(
    private appService: AppService
  ) {  }

  resolveContestantById(contestantId) {
    // const filtered = this.appService.getCurrentEvent().contestants.filter(c => c.id === contestantId);
    const filtered = CONTESTANTS.filter(c => c.id === contestantId);
    return filtered[0] || DEFAULT_CONTESTANT;
  }

  resolveContestantByValue(type, value) {
    // const filtered = this.appService.getCurrentEvent().contestants.filter(c => c[type] === value);
    const filtered = CONTESTANTS.filter(c => c[type] === value);
    return filtered[0] || DEFAULT_CONTESTANT;
  }
}
