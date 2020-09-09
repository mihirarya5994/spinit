import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
  private config: any = {};
  private marketingData: any = {};
  private userInfo: any = {};

  questions: any[] = [];
  timeOffset = 0;
  currentEvent: any = {};
  userProfile = {};
  hostApp = 'myjio';
  prizesAndBanners: any = null;
  sup;
  date;
  mon;
  dd;
  better;
  thanks;
  congrats;
  wheelID;

  public prize: string;

  setUserInfo(info) {
    this.userInfo = info;
    localStorage['userInfo'] = JSON.stringify(info);
  }

  getUserInfo() {
    const userInfo = localStorage['userInfo'];
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return this.userInfo;
  }

  setAllPrizesAndBanners(p) {
    this.prizesAndBanners = p;
  }

  setWheelid(wheelID) {
    this.wheelID = wheelID;
  }

  getAllPrizesAndBanners() {
    return this.prizesAndBanners;
  }

  setPrize(prize: string): void {
    this.prize = prize;
  }

  setDates(date, dd,  sup, mon) {
    this.date = date;
    this.dd = dd;
    this.sup = sup;
    this.mon = mon;
  }

  setDesc(congrats, better, thanks) {
    this.congrats = congrats;
    this.better = better;
    this.thanks = thanks;
  }

  setConfig(config) {
    this.config = config;
  }

  getConfigParam(param) {
    return this.config[param];
  }

  setUserProfile(profile) {
    Object.assign(this.userProfile, profile);
  }

  getUserProfile() {
    return this.userProfile;
  }

  setCurrentEvent(event) {
    this.currentEvent = event;
  }

  getCurrentEvent() {
    return this.currentEvent;
  }

  setCurrentTimeOffset(offset) {
    this.timeOffset = offset;
  }

  getCurrentTimeOffset() {
    return this.timeOffset;
  }

  setQuestions(questions) {
    this.questions = questions;
  }

  getAdobeData() {
    this.marketingData = localStorage["digitalData"];
    if (this.marketingData) {
      return JSON.parse(this.marketingData);
    }
  }

  getQuestions() {
    return this.questions;
  }

  setHostApp(app) {
    this.hostApp = app;
  }

  getHostApp() {
    return (this.hostApp || 'myjio').toLowerCase();
  }

  getOS() {
    if (navigator.userAgent.match(/Android/i)) {
      return 'android';
    }
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      return 'ios';
    }
    return 'others';
  }

  logout() {
    this.setUserInfo({});
  }
}
