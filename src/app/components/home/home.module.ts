import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { HomeComponent } from './home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LeaderboardComponent } from './../leaderboard/leaderboard.component';
import { SettingsComponent } from './../settings/settings.component';
import { VoteComponent } from '../vote/vote.component';
import { ProfileCaptureComponent } from '../profile-capture/profile-capture.component';
import { FaqComponent } from '../faq/faq.component';
import { HowToPlayComponent } from '../how-to-play/how-to-play.component';
import { TncComponent } from '../tnc/tnc.component';
import { PrizesComponent } from './../prizes/prizes.component';
import { ProfilePrizeComponent } from './../profile-prize/profile-prize.component';
import { VideoPlayerComponent } from './../video-player/video-player.component';
import { RecurringQuizComponent } from './../recurring-quiz/recurring-quiz.component';
import { ConfettiComponent } from './../confetti/confetti.component';

import { HomeRoutes } from './home.routing';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    LeaderboardComponent,
    SettingsComponent,
    VoteComponent,
    ProfileCaptureComponent,
    TncComponent,
    FaqComponent,
    HowToPlayComponent,
    PrizesComponent,
    ProfilePrizeComponent,
    VideoPlayerComponent,
    RecurringQuizComponent,
    ConfettiComponent
  ],
  imports: [
    SharedModule,
    HomeRoutes
  ],
  providers: []
})
export class HomeModule { }
