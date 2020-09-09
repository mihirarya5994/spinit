import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import { ProfileService } from './profile.service';
import { AppService } from './app.service';
import { Router } from '@angular/router';
import { QUESTION_TYPES } from 'src/app/app.constants';
declare let digitalData: any;
declare const _satellite: any;
declare const dataLayer : any;

@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  private appName = '';
  customerId: any;

  constructor(
    private profileService: ProfileService,
    private logger: LoggerService,
    private appService: AppService,
    private router: Router
  ) { }

  getUserData() {
    try {
      this.customerId = this.appService.getUserInfo().info.customerId;
    } catch (e) {
      this.customerId = '';
      this.logger.error('blank customer ID');
    }
  }
    initialize(appName) {
      this.appName = appName;
    }

    trackPage(pageName, pageStatus) {
      var campaignData: any = this.appService.getAdobeData();
      this.getUserData();
      try {
        digitalData = {
          page: {
            pageName,
            pageStatus,
            pageInfo: {
              appName: this.appName
            }
          },
          user: {
            bpid: this.customerId
          },
          campaign: campaignData
        };
        _satellite.track('pageLoad');
      } catch (e) {
        this.logger.error('Error tracking Link');
      }
    }

    trackLink(linkName, linkPosition, linkType) {
      try {
        digitalData = {
          link: {
            linkName,
            linkPosition,
            linkType
          }
        };
        _satellite.track('linkTracking');
      } catch (e) {
        this.logger.error('Error tracking Link');
      }
    }
    trackGAPages(arg){
      var pageData : any ={}
      try {
        pageData = {
          event: "virtualPageView", 
          virtualPageURL: this.router.url,
          virtualPageTitle: arg, 
          appName: 'Spin2Win',
          env:"dev"
        }
        dataLayer.push(pageData);
      } catch (e) {
        this.logger.error('Error tracking Page');
      }
    }

    trackGALink(new_Category, new_Action, new_Label, question){
      var linkData :any ={}
      try {
        linkData = {
          new_Category:new_Category,
          new_Label:new_Label,
          new_Action:new_Action,
          questionID: question,
          event:"funZone"
        };
        dataLayer.push(linkData);
      } catch (e) {
        this.logger.error('Error tracking Link');
      }
    }
}
