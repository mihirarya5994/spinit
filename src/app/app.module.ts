import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { CoreModule } from './core/core.module';
import { AppService } from './core/services/app.service';
import { RestService } from './core/services/rest.service';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { SplashComponent } from './components/splash/splash.component';

import { AppRoutes } from './app.routing';

import { environment } from './../environments/environment.prod';

export function loadConfig(appService: AppService, restService: RestService) {
  return () => restService
    .get(environment.configUrl)
    .toPromise()
    .then(config => appService.setConfig(config));
}

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent
  ],
  imports: [
  BrowserModule,
    CoreModule,
    AppRoutes,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-center'
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      multi: true,
      deps: [ AppService, RestService ]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
