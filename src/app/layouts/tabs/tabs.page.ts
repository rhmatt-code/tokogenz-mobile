import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import {
  IonContent,
  IonFooter,
  IonIcon,
  IonRouterOutlet
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  home,
  homeOutline,

  playCircle,
  playCircleOutline,

  storefront,
  storefrontOutline,

  person,
  personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,

  imports: [
    RouterOutlet,
    IonRouterOutlet,
    IonContent,
    IonFooter,
    IonIcon
  ],

  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss']
})
export class TabsPage {

  activeTab = 'home';

  constructor(
    private router: Router
  ) {

    addIcons({
      home,
      homeOutline,

      playCircle,
      playCircleOutline,

      storefront,
      storefrontOutline,

      person,
      personOutline
    });

    this.router.events
      .pipe(
        filter(
          event => event instanceof NavigationEnd
        )
      )
      .subscribe((event: any) => {

        const url = event.urlAfterRedirects;

        if (url.includes('/tabs/home')) {

          this.activeTab = 'home';

        } else if (
          url.includes('/tabs/discover') ||
          url.includes('/tabs/live')
        ) {

          this.activeTab = 'discover';

        } else if (
          url.includes('/tabs/orders')
        ) {

          this.activeTab = 'orders';

        } else if (
          url.includes('/tabs/profile')
        ) {

          this.activeTab = 'profile';

        }

      });

  }

  changeTab(url: string) {

    this.router.navigateByUrl(
      url
    );

  }

}