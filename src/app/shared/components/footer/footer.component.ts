import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';

declare const atag: any;

@Component({
  selector: 'bb-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() private showDefaultSelection = true;

  navLinks: any[] = [
    { title: 'Home', route: '/bb', img: 'home.svg', activeImg: 'Home_S.svg' },
    { title: 'Prizes', route: '/bb/prizes', img: 'Prizes.svg', activeImg: 'Prizes_S.svg' },
    { title: 'Settings', route: '/bb/settings', img: 'Settings.svg', activeImg: 'Settings_S.svg' }
  ];
  activeItem;

  constructor(
    private router: Router
  ) {

  }

  ngOnInit() {
    if (this.showDefaultSelection) {
      this.activeItem = this.navLinks[0];
      console.log(this.navLinks)
    }
    this.router
      .events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        const activatedLink = this.navLinks.filter(l => l.route === event.url);
        if (event.url === '/ugc/thank-you') {
          this.activeItem = null;
        } else {
          this.activeItem = activatedLink.length ? activatedLink[0] : null;
          // console.log(this.activeItem, 'cu');
          // const digitalData = {
          //   link: {
          //     linkName: this.activeItem.title,
          //     linkPosition: 'Bottom',
          //     linkType: 'AsianPaint'
          //   },
          // };
          // atag(digitalData);

        }
      });
  }

  navigate(link) {
    this.activeItem = link;
    this.router.navigate([link.route]);
    // const digitalData = {
    //   page: {
    //     pageInfo:
    //     {
    //       appName: 'AsianPaint Campaign'
    //     }
    //   },
    //   link: {
    //     linkName: this.activeItem.title,
    //     linkPosition: 'Bottom',
    //     linkType: 'AsianPaint'
    //   },
    // };
    // atag(digitalData);
  }
}
