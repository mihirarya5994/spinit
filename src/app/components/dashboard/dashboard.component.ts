import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import * as Flickity from 'flickity';
import * as jsPDF from 'jspdf';
import oreo from '../../../assets/config/oreo.json';

declare const atag: any;
declare var $: any;



import { AppService } from '../../core/services/app.service';
import { RestService } from '../../core/services/rest.service';
import { ExternalInterfaceService } from '../../core/services/external-interface.service';
import { EventEmitterService } from './../../core/services/event-emitter.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { preserveWhitespacesDefault } from '@angular/compiler';
import { TrackerService } from 'src/app/core/services/tracker.service.js';
// import { $ } from 'protractor';


@Component({
  selector: 'bb-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  loading = false;
  prizeDesc: any;
  profile: {};
  digitalData;
  quesTag = false;
  questionID;
  logo;
  sponsorText = true;
  colours = false;


  constructor(
    private router: Router,
    private appService: AppService,
    private restService: RestService,
    private profileService: ProfileService,
    private externalInterfaceService: ExternalInterfaceService,
    private eventEmitterService: EventEmitterService,
    private trackerService: TrackerService,
    private cdRef: ChangeDetectorRef

  ) {

    this.profile = this.profileService.getProfileSync();
    console.log(this.profile);

    let customerId;
    if (this.appService.getUserInfo().info && this.appService.getUserInfo().info.customerId) {
      customerId = this.appService.getUserInfo().info.customerId;
    } else {
      customerId = '';
    }
    this.digitalData = {
      page: {
        pageName: 'STW Home page',
        pageInfo:
        {
          appName: 'Daily_Stream'
        }
      },
      user: {
        bpid: customerId,
      }
    };
    atag(this.digitalData);

    this.trackerService.trackGAPages("STW Home Page");
  }

  date;
  wheelID;
  Winner = false;
  Winner2 = false;
  spinloading = false;
  currentQuestionIndex = 1;
  private intervalId = null;
  quiz = [];
  currentQuestion: any = null;
  selectedOption;
  answerCorrect;
  answerWrong;
  Spin_Land;
  Spin_Prize;
  prizeType;
  today1;
  today2;

  private tabs = {
    "_id": "5ecd45df3d0751eb935c6ebf",
    "prizes": [
      {
        "id": 1,
        "name": "50 RS",
        "desc": "Recharge",
        "colour": "#FE0000",
        "prizeType": "medium",
        "probability": 15
      },
      {
        "id": 2,
        "name": "10 RS",
        "desc": "Recharge",
        "colour": "#FBB03B",
        "prizeType": "medium",
        "probability": 15
      },
      {
        "id": 3,
        "name": "No Prize",
        "desc": "",
        "colour": "#D9E021",
        "prizeType": "empty",
        "probability": 30
      },
      {
        "id": 4,
        "name": "200 RS",
        "desc": "Recharge",
        "colour": "#009345",
        "prizeType": "high",
        "probability": 5
      },
      {
        "id": 5,
        "name": "5 GB",
        "desc": "Free Data",
        "colour": "#01A99C",
        "prizeType": "high",
        "probability": 5
      },
      {
        "id": 6,
        "name": "No Prize",
        "desc": "",
        "colour": "#93268F",
        "prizeType": "empty",
        "probability": 30
      }
    ],
    "wheelID": "52dd2853-7213-440a-9e58-dea235655641",
    "cOn": "2020-05-26T16:37:51.023Z",
    "__v": 0,
    "didSpin": false,
    "didWin": false
  }

  adComponentId;

  @ViewChild('ad', { static: false }) adElement: ElementRef;


  ngOnInit() {

    // this.router.navigate(['/bb/vote']);
    this.loading = true;
    this.restService
      .get(this.appService.getConfigParam('API_HOST_GAME') + '/wheel')
      .subscribe(res => {
        console.log(res);
        if (res.didSpin === true) {
          console.log(res.wheelID);
          this.appService.setWheelid(res.wheelID);
          this.wheelID=res.wheelID;
          console.log('already spin');
          this.today2 = res.thank_you.cbOn;
          var thanks = res.thank_you.desc;
          var dd2 = new Date(this.today2).getDate();
          var mm2 = new Date(this.today2).getMonth()+1;
          var yyyy2 = new Date(this.today2).getFullYear();
          var sup;
          this.date = dd2 +'/' + mm2 +'/' + yyyy2;     
          this.appService.setDates(this.date , '', '', '');
          this.appService.setDesc('', '', thanks);
          this.loading = true;
          this.router.navigate(['/bb/how-to-play']);
        } else {
          if(res.sponsorLogo === ''){
            this.sponsorText = false;
          } else {
            this.sponsorText = true;
          }
          console.log(res.wheelID);
          this.appService.setWheelid(res.wheelID);
          this.wheelID=res.wheelID;
          this.loading = false;
          this.logo = res.sponsorLogo;
          this.today1 = res.congrats.cbOn;
          this.today2 = res.thank_you.cbOn;
          var congrats = res.congrats.desc;
          var betterLuck = res.better_luck.desc;
          var thanks = res.thank_you.desc;
          var dd1 = new Date(this.today1).getDate();
          var mm1 = new Date(this.today1).getMonth()+1;
          var dd2 = new Date(this.today2).getDate();
          var mm2 = new Date(this.today2).getMonth()+1;
          var yyyy2 = new Date(this.today2).getFullYear();
          var sup;
          this.date = dd2 +'/' + mm2 +'/' + yyyy2;
          if(dd1 === 1 || dd1 === 21  || dd1 === 31 ) {
            sup = 'st';
          } else if (dd1 === 2 ||  dd1 === 22) {
            sup ='nd';
          } else if( dd1 === 3 || dd1 === 23) {
            sup = 'rd';
          } else {
            sup = 'th';
          }
          var mon;
          switch(mm1) {
            case 1:
              mon = 'January';
              break;
            case 2:
              mon = 'February';
              break;
            case 3:
              mon = 'March';
              break;
            case 4:
              mon = 'April';
              break;
            case 5:
              mon = 'May';
              break;
            case 6:
              mon = 'June';
              break;
            case 7:
              mon = 'July';
              break;
            case 8:
              mon = 'August';
              break;
            case 9:
              mon = 'September';
              break;
            case 10:
              mon = 'October';
              break;
            case 11:
              mon = 'November';
              break;
            case 12: 
              mon = 'December'
              break;
          }
          console.log(mon);
          console.log(sup);
          this.appService.setDates(this.date , dd1, sup, mon);
          this.appService.setDesc(congrats, betterLuck, thanks);
          console.log(this.logo)
          this.tabs = res.prizes;
          console.log(this.tabs);
          this.spinloading = true;
        }
      })

    this.adsInit();




    // this.wheel.wheel.textAlignment = 'outer';
    // this.wheel.wheel.ctx.font = '10px Montserrat-Black';
    // this.wheel.wheel.textFontFamily = 'Montserrat-Black';
    // this.wheel.wheel.canvas.style.fontFamily = 'Montserrat-Black';
    // this.wheel.wheel.segments[1].textFontFamily = 'Montserrat-Black';

  }

  ngAfterViewInit() {


    // this.externalInterfaceService.requestAdParams();
  }

  getQuiz(type) {

    this.restService
      .get(this.appService.getConfigParam('API_HOST_GAME') + '/questions/spin/'
      +this.wheelID+
      '?prizeType=' + type)
      //  .get('../../../assets/config/questions-localset-cl.json')
      .subscribe(res => {
        this.quiz = res.questions;
        console.log(this.quiz);
        // (this.quiz).forEach(q => {
        //   this.currentQuestion = q;
        // });

        this.currentQuestion = this.quiz[0];
        if (this.quiz.length > 1) {
          this.quesTag = true;
        }

      });

  }

  selectOption(option) {
    console.log(option);
    this.selectedOption = option.desc;
    


    const answerobject = {};

    answerobject['questionId'] = this.currentQuestion.qID;
    answerobject['userAnswer'] = option.id;
    console.log(answerobject);


    this.restService
      .post(this.appService.getConfigParam('API_HOST_GAME') + '/questions/spin/answer', answerobject)
      .subscribe(res => {
        if (res['answeredCorrect'] === true) {
          this.answerCorrect = option.desc;
          setTimeout(() => {
            this.showNextQuestion();
          }, 1000);
          this.digitalData = {
            link: {
              linkName: 'STW_Correct',
              linkPosition: 'Middle',
              linkType: 'STW_' + option.desc
            },
            questionID: this.currentQuestion._id
          }; atag(this.digitalData);
          this.trackerService.trackGALink('Spin the Wheel', 'Correct', 'STW Quiz Pop-up', this.Spin_Prize + this.prizeDesc);
        } else {
          this.answerWrong = option.desc;
          this.answerCorrect = res['correctAnswer'];
          setTimeout(() => {
            this.loading = true;
            this.router.navigate(['/bb/faq', {
              status: 'lost'
            }]);
          }, 1000);
          this.digitalData = {
            link: {
              linkName: 'STW_Incorrect',
              linkPosition: 'Middle',
              linkType: 'STW_' + option.desc
            },
            questionID: this.currentQuestion._id
          }; atag(this.digitalData);
          this.trackerService.trackGALink('Spin the Wheel', 'Incorrect', 'STW Quiz Pop-up', ' ' +this.currentQuestionIndex);

        }
      });

    // if (this.currentQuestionIndex === 5) {
    //   return;
    // } else {
    //   setTimeout(() => {
    //     this.selectedOption = '';
    //     this.showNextQuestion();
    //   }, 1500);
    // }

    // setTimeout(()=>{
    //   if(option.id === 'a') {
    //     this.answerCorrect = option.desc;

    //     setTimeout(() => {
    //       this.showNextQuestion();
    //     }, 1000);

    //   } else {
    //     this.answerWrong = option.desc;
    //     console.log('quiz ends');
    //     setTimeout(() => {
    //       this.router.navigate(['/bb/faq',{
    //         status: 'lost'
    //       }]);
    //     }, 1000);
    //   }

    // },1000);
  }

  showNextQuestion() {
    this.selectedOption = '';
    this.answerCorrect = '';
    this.currentQuestion = this.quiz[this.currentQuestionIndex++];

    if (this.currentQuestionIndex > this.quiz.length) {
      this.loading = true;
      console.log('prize before sending', this.Spin_Prize);
      this.appService.setPrize(this.Spin_Prize + ' ' + this.prizeDesc);
      setTimeout(() => {
        this.router.navigate(['/bb/faq', {
          status: 'winner',
        }]);
      }, 1000);
    } else if (this.currentQuestion) {
      this.startTimer();
      // this.getQuizImages();
    }
  }




  startTimer() {
    this.stopTimer();
    this.intervalId = setInterval(() => {
      if (this.currentQuestion.duration > 0) {
        this.currentQuestion.duration--;
      } else {
        this.stopTimer();
        setTimeout(() => {
          this.showNextQuestion();
          // this.getQuizImages();
        }, this.appService.getConfigParam('QUIZ_BREATHING_TIME'));
      }
    }, 100000);
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  adsInit() {
    setTimeout(() => {
      this.adComponentId = 'ad_' + Date.now();
      this.adElement.nativeElement.setAttribute('id', this.adComponentId);
    }, 1500);
  }


  getspin() {
    this.restService
      .get(this.appService.getConfigParam('API_HOST_GAME') + '/wheel/spin')
      .subscribe(res => {
        // global variable save res
        this.Spin_Land = res.id;
        this.Spin_Prize = res.name;
        this.prizeType = res.prizeType;
        this.prizeDesc = res.desc;
        this.spin(this.Spin_Land);
      })
      this.trackerService.trackGALink('Spin the Wheel', 'Spin', 'STW Home Page', '');
  }

  spin(id){ 


    console.log(id);

    let deg;
    if( id === '1') {
      deg =  3600;

    } else if (id === '2') {
      deg = 3540;

    } else if (id === '3') {
      deg = 3480;

    } else if ( id === '4') {
      deg = 3780;

    } else if ( id === '5') {
      deg = 3720;
    } else if ( id == '6') {
      deg = 3660;

    }
    ; // Math.floor(Math.random() * (x - y)) + y;
  
    document.getElementById('box').style.transform = "rotate("+deg+"deg)";

    setTimeout(() => {
      this.after();
    }, 10000);
  
    // var element = document.getElementById('mainbox');
    // element.classList.remove('animate');
    // setTimeout(function(){
    //   element.classList.add('animate');
    // }, 5000); //5000 = 5 second

    this.digitalData = {
      link: {
        linkName: 'STW_Spin',
        linkPosition: 'Bottom',
        linkType: 'STW_' + this.Spin_Prize + ' ' + this.prizeDesc
      }
    }; atag(this.digitalData);
  }

  after() {
    // alert('You have been bamboozled')
    // $("#quiz").show()
    if (this.prizeType === 'empty') {
      this.loading = true;
      this.router.navigate(['/bb/faq', {
        status: 'lost'
      }])
    } else if(this.prizeType !== 'empty') {
      this.Winner = true;
      this.getQuiz(this.prizeType);
      setTimeout(() => {
        this.Winner2 = true;
      }, 1000)

      this.trackerService.trackGALink('Spin the Wheel', 'Quiz Pop-up', 'STW Home Page', this.Spin_Prize + ' ' + this.prizeDesc);
    }
    // this.eventEmitterService.emit({ type: 'SHOW_CONFETTI', data: { clickable: false } });
  }



}

function asSpinWheelData(spinData) {
  return spinData.prizes.map((data) => ({
    id: data.id,
    name: data.name,
    desc: data.desc,
    colour: data.colour,
    prizeType: data.prizeType,
    degree: (data.id - 1) * 60
  }))
}
