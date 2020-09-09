import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { SettingsComponent } from '../settings/settings.component';
import { VoteComponent } from '../vote/vote.component';
import { ProfileCaptureComponent } from '../profile-capture/profile-capture.component';
import { TncComponent } from '../tnc/tnc.component';
import { FaqComponent } from '../faq/faq.component';
import { HowToPlayComponent } from '../how-to-play/how-to-play.component';
import { PrizesComponent } from './../prizes/prizes.component';
import { RecurringQuizComponent } from './../recurring-quiz/recurring-quiz.component';

import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [{
      path: '',
      component: DashboardComponent,
      pathMatch: 'full',
      data: { showHeader: true, showFooter: true, showParticipantsCount: false },
      canActivate: [ AuthGuard ]
    }, {
      path: 'profile-capture',
      component: ProfileCaptureComponent,
      data: { showHeader: false, showFooter: false, showParticipantsCount: false },
      canActivate: [ AuthGuard ]
    }, {
      path: 'leaderboard',
      component: LeaderboardComponent,
        data: { showHeader: true, showFooter: true, showParticipantsCount: true },
      canActivate: [ AuthGuard ]
    }, {
      path: 'prizes',
      component: PrizesComponent,
      data: { showHeader: true, showFooter: true, showParticipantsCount: true },
      canActivate: [ AuthGuard ]
    }, {
      path: 'settings',
      component: SettingsComponent,
      data: { showHeader: true, showFooter: true, showParticipantsCount: true },
      canActivate: [ AuthGuard ]
    }, {
      path: 'vote',
      component: VoteComponent,
      data: { showHeader: true, showFooter: true, showParticipantsCount: true },
      canActivate: [ AuthGuard ]
    }, {
      path: 'recurring-quiz',
      component: RecurringQuizComponent,
      data: { showHeader: true, showFooter: true, showParticipantsCount: true },
      canActivate: [AuthGuard]
    },{
      path: 'recurring-quiz/:id',
      component: RecurringQuizComponent,
      data: { showHeader: true, showFooter: true, showParticipantsCount: true },
      canActivate: [AuthGuard]
    }, {
      path: 'tnc',
      component: TncComponent,
      data: { showHeader: true, showFooter: false, showParticipantsCount: true },
      canActivate: [ AuthGuard ]
    }, {
      path: 'faq',
      component: FaqComponent,
      data: { showHeader: true, showFooter: false, showParticipantsCount: true },
      canActivate: [ AuthGuard ]
    }, {
      path: 'how-to-play',
      component: HowToPlayComponent,
      data: { showHeader: true, showFooter: false, showParticipantsCount: true },
      canActivate: [ AuthGuard ]
    }]
  }
];

export const HomeRoutes = RouterModule.forChild(routes);
