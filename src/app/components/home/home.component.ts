import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';

import { ProfileService } from '../../core/services/profile.service';
import { EventEmitterService } from './../../core/services/event-emitter.service';

import { CONTESTANTS } from '../../app.constants';

@Component({
  selector: 'bb-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showHeader = true;
  showFooter = false;
  showParticipantsCount = false;
  onQuizScreen = false;
  showConfetti = false;
  onThankYouScreen = false;
  confettiClickable = false;
  showLostscreen = false;
  showWonscreen = false;
  showCompletescreen = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    if (
      typeof this.activatedRoute.snapshot.firstChild.data.showHeader !==
      'undefined'
    ) {
      this.showHeader = this.activatedRoute.snapshot.firstChild.data.showHeader;
      this.showFooter = this.activatedRoute.snapshot.firstChild.data.showFooter;
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.showHeader = this.activatedRoute.snapshot.firstChild.data.showHeader;
        this.showFooter = this.activatedRoute.snapshot.firstChild.data.showFooter;
        this.showParticipantsCount = this.activatedRoute.snapshot.firstChild.data.showParticipantsCount;
      });

    this.profileService.getProfile().subscribe(res => {
      if (res.profileCompleted) {
        this.showFooter = true;
      }
    });

    this.eventEmitterService.subscribe(event => {
      if (event.type === 'THANK_YOU_INIT') {
        this.onThankYouScreen = true;
      } else if (event.type === 'QUIZ_SCREEN_DESTROY') {
        this.onQuizScreen = false;
      } else if (event.type === 'SHOW_CONFETTI') {
        this.showConfetti = true;
        this.confettiClickable = event.data.clickable;
      } else if (event.type === 'HIDE_CONFETTI') {
        this.showConfetti = false;
        this.confettiClickable = false;
      } else if (event.type === 'LOST_SCREEN') {
        this.showLostscreen = true;
      } else if (event.type === 'WON_SCREEN') {
        this.showWonscreen = true;
      }
    });
  }

  hideConfetti() {
    this.showConfetti = false;
    this.eventEmitterService.emit({ type: 'HIDE_CONFETTI', data: {} });
  }
}
