import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

declare const atag: any;

@Component({
  selector: 'bb-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent {
  @Input() url = null;
  @Input() videoF: string;
  @Output() close: EventEmitter<any> = new EventEmitter();

  digitalData;

  constructor( private router: Router){

  //   this.digitalData = {
  //     link:{
  //     linkName: 'Video Play',
  //     linkPosition:'Body',
  //     linkType:'AsianPaint'
  //   }
  // }
  // atag(this.digitalData);

  }
   


  checkMedia(event) {
    const video = event.target;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  showQuiz() {
    // gtag('event', 'Start Quiz', {
    //   event_category: 'Andhadhun_Movie_Quiz',
    //   event_label: 'NA'
    // });

  //   this.digitalData = {
  //     link:{
  //     linkName: 'Take Quiz',
  //     linkPosition:'Body',
  //     linkType:'AsianPaint'
  //   }
  // }
  // atag(this.digitalData);
    this.router.navigate(['/bb/recurring-quiz']);
 }

  back() {
    this.close.emit();
  }
}
