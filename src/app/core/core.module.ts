import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AuthGuard } from './guards/auth.guard';

import { AppService } from './services/app.service';
import { RestService } from './services/rest.service';
import { LoggerService } from './services/logger.service';
import { ExternalInterfaceService } from './services/external-interface.service';
import { DataService } from './services/data.service';
import { ContestantService } from './services/contestant.service';
import { CountdownService } from './services/countdown.service';
import { SocketService } from './services/socket.service';
import { ProfileService } from './services/profile.service';
import { EventEmitterService } from './services/event-emitter.service';

import { EventResolver } from './resolvers/event.resolver';

const services = [ AppService, RestService, LoggerService, ExternalInterfaceService, DataService, ContestantService,
  CountdownService, EventResolver, EventEmitterService, SocketService, ProfileService ];
const pipes = [];
const guards = [ AuthGuard ];

@NgModule({
  imports: [
  CommonModule,
    HttpClientModule
  ],
  declarations: [
    ...pipes
  ],
  providers: [
  ...services,
  ...guards
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    ...pipes
  ]
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
