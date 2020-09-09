import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

declare const atag: any;
declare var $: any;

import { AppService } from './../../core/services/app.service';
import { RestService } from './../../core/services/rest.service';
import { ContestantService } from './../../core/services/contestant.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { LoggerService } from './../../core/services/logger.service';
import { EventEmitterService } from './../../core/services/event-emitter.service';
import { ExternalInterfaceService } from './../../core/services/external-interface.service';

import { util } from './../../util';
import oreo from '../../../assets/config/oreo.json';

@Component({
  selector: 'bb-recurring-quiz',
  templateUrl: './recurring-quiz.component.html',
  styleUrls: ['./recurring-quiz.component.scss']
})
export class RecurringQuizComponent implements OnInit, OnDestroy {
  quiz: any = { questions: [] };
  currentQuestion: any = null;
  showQuizResults = false;
  loading = true;
  quizType;
  currentQuestionIndex = 0;
  pointsWon = 0;
  myProfile: any = {};
  sms: any;
  profile: any;
  qcount;
  count;
  level;
  answers = [];
  level_response;
  level_text;
  user_score;
  max_score;
  user_text1;
  user_text2;
  btn_text;
  enableSubmit = false;
  levels_complete = false;
  selectedOption;

  private intervalId = null;
  quizImageURL: any;
  quizImageIndex: number;

  constructor(
    private router: Router,
    private appService: AppService,
    private restService: RestService,
    private contestantService: ContestantService,
    private profileService: ProfileService,
    private logger: LoggerService,
    private eventEmitterService: EventEmitterService,
    private externalInterfaceService: ExternalInterfaceService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => this.sms = params);

    this.profile = this.profileService.getProfileSync();
    let customerId;
    if (this.appService.getUserInfo().info && this.appService.getUserInfo().info.customerId) {
      customerId = this.appService.getUserInfo().info.customerId;
    } else {
      customerId = '';
    }
    const digitalData = {
      page: {
        pageName: 'JioSaavn Quiz Page',
        pageInfo:
        {
          appName: 'JioSaavn'
        }
      },
      user: {
        bpid: customerId,
        //     name: this.profile.name,
        //     ageGroup: this.profile.ageGroup,
        //     state: this.profile.state,
        //     gender: this.profile.gender
      }
    };
    atag(digitalData);
  }

  ngOnInit() {
    // console.log(this.sms, 'SMS');
    this.profileService.getProfile()
      .subscribe(profile => {
        this.logger.log('done');
        this.myProfile = profile;
      });
    this.eventEmitterService
      .emit({
        type: 'QUIZ_SCREEN_INIT',
        data: null
      });
    this.getQuiz();
    // this.quizImageIndex = 0;
    // this.quizImageURL = oreo.quizImages[this.quizImageIndex];
  }

  // getQuizImages() {
  //   this.quizImageURL = oreo.quizImages[this.quizImageIndex];
  //   this.quizImageIndex++;
  // }
  getQuiz() {
    this.restService
      .get(this.appService.getConfigParam('API_HOST') + '/saavn/weekquiz')
      //  .get('../../../assets/config/questions-localset-cl.json')
      .subscribe(res => {
        this.answers = [];
        this.selectedOption = '';
        this.quiz = res;
        if (this.quiz.level === 4) {
          this.router.navigate(['bb/vote']);
        }
        // let level = 2;
        // console.log(this.qcount);
        // // (this.quiz ()  => {
        if (!this.quiz.answered) {
          this.level = this.quiz.level;
          console.log('inside for');
          (this.quiz.questions || []).forEach(q => {
            this.currentQuestion = this.quiz.questions;
            console.log(this.currentQuestion);
            if (q.playerId) {
              q.contestant = this.contestantService.resolveContestantByValue('id', q.playerId);

            }
          });
        }

        if (this.quiz.answered) {
          console.log('inside this');
          (this.quiz.questions || []).forEach(q => {
            q.isCorrectAnswer = !!_.intersection(
              q.answer,
              q.userAnswer
            ).length;

            if (q.isCorrectAnswer) {
              this.pointsWon += q.points;
            }

            (q.opt_eng || [])
              .filter(o => (q.userAnswer || []).indexOf(o.id) > -1)
              .forEach(o => {
                o[q.answer.indexOf(o.id) > -1 ? 'correct' : 'incorrect'] = true;
              });

            q.opt_eng.forEach(o => {
              if (q.answer.indexOf(o.id) > -1) {
                o.correct = true;
              }
            });
          });
          this.showQuizResults = true;

          // console.log(this.quiz,this.quiz.questions[0]._id, 'completQ');
          //
          // gtag('config', 'UA-56816637-76', {
          //   'page_title' : 'Andhadhund Thank You Page',
          //   'page_path': '/AndhadhundThankYouPage'
          //   });
        } else if (!(this.quiz.questions && this.quiz.questions.length)) {
          // quiz not available
        } else {
          this.showNextQuestion();

        }
        this.loading = false;
      });
  }

  gotoQuiz() {
    if (this.levels_complete === true) {
      this.router.navigate(['bb/vote']);
    }
    this.enableSubmit = false;
    this.getQuiz();

    // this.router.navigate(['/bb/recurring-quiz']);
    // this.currentQuestion = [];
    // this.getQuiz();

    // this.showNextQuestion();
    this.close();
    const digitalData = {
      link: {
        linkName: 'Try Again',
        linkPosition: 'Middle',
        linkType: 'Button'
      }
    }; atag(digitalData);
  }

  open() {
    $('#exampleModal').show();
  }

  close() {
    this.currentQuestionIndex = 0;
    $('#exampleModal').hide();
  }

  showNextQuestion() {
    // this.selectedOption = false;
    // this.getQuizImages();
    this.currentQuestion = this.quiz.questions[this.currentQuestionIndex++];

    if (this.currentQuestion) {
      this.startTimer();
      // this.getQuizImages();
    }
    if (this.currentQuestionIndex > 5) {
      return;
    }
  }

  startTimer() {
    this.stopTimer();
    this.intervalId = setInterval(() => {
      if (this.currentQuestion.duration > 0) {
        this.currentQuestion.duration--;
      } else {
        this.stopTimer();
        this.evaluateUserAnswer();
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

  selectOption(option) {
    console.log(option);
    this.selectedOption = option.desc;
    console.log(this.selectedOption.length);
    const answerobject = {};
    const answer = [];
    answerobject['qId'] = this.currentQuestion._id;
    answer.push(option.id);
    answerobject['answer'] = answer;
    console.log(answer);
    console.log(answerobject);
    this.answers.push(answerobject);
    console.log(this.answers);
    if (this.currentQuestionIndex === 5) {
      this.enableSubmit = true;
      return;
    } else {
      setTimeout(() => {
        this.selectedOption = '';
        this.showNextQuestion();
      }, 1500);
    }
    // if (this.currentQuestion.submitting || this.currentQuestion.duration <= 0) {
    //   return;
    // }
    // if (option.selected) {
    //   option.selected = false;
    // } else {
    //   if (this.currentQuestion.noOfAnswer === 1) {
    //     this.currentQuestion.opt_eng.forEach(c => c.selected = false);
    //     // option.selected = true;
    //     setTimeout(() => {
    //        this.evaluateUserAnswer();
    //     }, this.appService.getConfigParam('QUIZ_BREATHING_TIME'));
    //   } else {
    //     const selectedOptions = this.currentQuestion.opt_eng.filter(o => o.selected);
    //     if (selectedOptions.length < this.currentQuestion.noOfAnswer) {
    //       option.selected = true;
    //     }
    //   }
    // }
  }

  submitQuiz() {
    // (this.quiz.questions).forEach(q => {
    //   q._id.push(this.answers);
    // });
    // console.log(this.answers);
    // // this.submitAnswer(questions);
    this.restService.post(
      this.appService.getConfigParam('API_HOST') + '/saavn/weeekquiz/questions/answer',
      {
        answers: this.answers
      }
    )
      .subscribe(res => {
        this.level_response = res;
        console.log(this.level_response.isWeekQuizCompleted);
        if (this.level_response.isWeekQuizCompleted===true && this.level_response.level === 3) {
          console.log('inside complete');
          this.levels_complete = true;
          console.log(this.levels_complete);
        }
        this.user_score = this.level_response.correctCount;
        this.max_score = this.level_response.total;
        if (this.user_score === this.max_score) {
          this.user_text1 = 'Awesome';
          this.user_text2 = 'Complete all the level to win the prize';
          this.btn_text = 'Continue';
        } else {
          this.user_text1 = 'Sorry!';
          this.user_text2 = 'You gave wrong answers';
          this.btn_text = 'Try Again';
        }
      });
    this.open();
    const digitalData = {
      link: {
        linkName: 'Answer Submit',
        linkPosition: 'Bottom',
        linkType: 'Button'
      }
    }; atag(digitalData);
  }

  // submitAnswer(questions) {
  //   const q = questions.shift();
  //   if (q && q.userAnswer.length) {
  //     this.restService.post(
  //       this.appService.getConfigParam('API_HOST') + '/devsaavn/weekquiz/questions/answer',
  //       {
  //         answer: q.userAnswer.map(o => o.id)
  //       }
  //     )
  //       .subscribe(res => this.submitAnswer(questions));
  //   } else {
  //     this.profileService.getProfile()
  //       .subscribe(profile => {
  //         this.logger.log('done');
  //       });
  //     this.showQuizResults = true;

  //     // let digitalData = {
  //     //   link:{
  //     //   linkName: 'Quiz Complete',
  //     //   linkPosition:'Body',
  //     //   linkType:'AsianPAint'
  //     //   },
  //     //   question:{
  //     //   questionID: this.quiz.questions[0]._id,
  //     //   questionText: this.quiz.questions[0].qDesc,
  //     //   answer:this.quiz.questions[0].answer[0],
  //     //   optionNumber: this.quiz.questions[0].userAnswer[0]
  //     //   }
  //     //   }
  //     // atag(digitalData);

  //     // console.log(this.quiz, questions, 'completQ1');
  //   }
  // }

  evaluateUserAnswer() {
    if (this.currentQuestion.submitting) {
      return;
    }
    this.currentQuestion.submitting = true;
    this.currentQuestion.userAnswer = this.currentQuestion.opt_eng.filter(o => o.selected);
    if (this.currentQuestion.userAnswer && this.currentQuestion.userAnswer.length) {
      this.currentQuestion.isCorrectAnswer = !!_.intersection(
        this.currentQuestion.answer,
        (this.currentQuestion.userAnswer || []).map(o => o.id)
      ).length;
      if (this.currentQuestion.isCorrectAnswer) {
        this.pointsWon += this.currentQuestion.points;
        this.eventEmitterService.emit({ type: 'SHOW_CONFETTI', data: { clickable: false } });
      }
    }
    (this.currentQuestion.userAnswer || []).forEach(o => {
      o[this.currentQuestion.answer.indexOf(o.id) > -1 ? 'correct' : 'incorrect'] = true;
    });
    this.currentQuestion.opt_eng.forEach(o => {
      if (this.currentQuestion.answer.indexOf(o.id) > -1) {
        o.correct = true;
      }
    });
    this.stopTimer();
    setTimeout(() => {
      this.showNextQuestion();
    }, this.appService.getConfigParam('QUIZ_BREATHING_TIME'));
  }
  navigateToMovie() {
    if (this.quiz.answered) {
      // gtag('event', 'Watch_Cinema',{'event_category' : 'Andhadhun_Movie_Quiz',
      //   'event_label': 'Thank_Page'});
    } else {
      // gtag('event', 'Watch_Cinema',{'event_category' : 'Andhadhun_Movie_Quiz',
      // 'event_label': 'LevelCompleted_Page'});
    }
    this.externalInterfaceService.launchBrowser(
      'http://jioimages.cdn.jio.com/mailer/user-agent.html?id=fefeb23024a111e99f690d39b2f2fb61&type=0&referrer=utm_source=AndhadhunPlayAlong'
    );
  }

  ngOnDestroy() {
    this.stopTimer();
    this.eventEmitterService
      .emit({
        type: 'QUIZ_SCREEN_DESTROY',
        data: null
      });
  }
}
