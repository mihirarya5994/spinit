import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { AppService } from './app.service';

export interface ICountdown {
  days: number,
  hours: number;
  minutes: number;
  seconds: number;
}

@Injectable({
  providedIn: 'root'
})
export class CountdownService {
  public countdown$: Subject<ICountdown> = new Subject();
  private intervalId = null;

  constructor(
    public appService: AppService
  ) {  }

  startCountdown(date) {
    this.intervalId = setInterval(() => {
      this.calculateTimeLeft(date, this.intervalId);
    }, 1000);
    this.calculateTimeLeft(date, null);
  }

  calculateTimeLeft(futureDate, intervalId) {
    const clientOffset = this.appService.getCurrentTimeOffset();
    const diff = Math.floor((futureDate.valueOf() - new Date().valueOf() + clientOffset) / 1000);
    if (diff <= 0) {
      if (intervalId) {
        clearInterval(intervalId);
        this.countdown$
          .next({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          });
      }
    } else {
      this.convertMillisecondsToHMS(diff);
    }
  }

  convertMillisecondsToHMS(millis) {
    const days = Math.floor(millis / (24 * 60 * 60));
    millis -= days * 86400;
    const hours = Math.floor(millis / (60 * 60));
    millis -= hours * 3600;
    const minutes = Math.floor(millis / 60) % 60;
    millis -= minutes * 60;
    const seconds = millis % 60;

    this.countdown$
      .next({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      });
  }

  stopCountdown() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
