import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IonContent, IonHeader, IonSpinner, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-splash',
  standalone: true,

  imports: [
    IonHeader,
    IonContent,
    IonSpinner,
    IonToolbar,
    IonTitle
  ],

  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss']
})
export class SplashPage implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {

    console.log('Splash Start');

    try {

      const token =
        await this.auth.getToken();

      console.log('TOKEN:', token);

      if (!token) {

        console.log('No Token');

        await this.router.navigateByUrl(
          '/tabs/home',
          {
            replaceUrl: true
          }
        );

        return;
      }

      console.log('🔄 Refresh User');

      const user =
        await this.auth.refreshUser();

      console.log('USER:', user);

      await this.router.navigateByUrl(
        '/tabs/home',
        {
          replaceUrl: true
        }
      );

    } catch (error) {

      console.error(
        'SPLASH ERROR:',
        error
      );

      await this.auth.logout();

      await this.router.navigateByUrl(
        '/login',
        {
          replaceUrl: true
        }
      );

    }

  }

}
