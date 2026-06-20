  import { Component } from '@angular/core';
  import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
  import { App } from '@capacitor/app';
  import { AuthService } from './core/services/auth.service';
  import { Router } from '@angular/router';
  import { OneSignalPlugin } from 'onesignal-cordova-plugin';
  import { OneSignalService } from './core/services/onesignal.service';

  @Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [IonApp, IonRouterOutlet],
  })
  export class AppComponent {
    constructor(
    private auth: AuthService,
    private router: Router,
    private oneSignal: OneSignalService
  ) {

    this.initApp();
    App.addListener(
    'appUrlOpen',
    async (event) => {

      console.log(
        'APP URL OPEN',
        event.url
      );

      const url = event.url;

      if (
        url.includes(
          'login-success'
        )
      ) {

        console.log(
          'LOGIN SUCCESS URL DETECTED'
        );

        const token =
          new URL(url)
            .searchParams
            .get('token');

        console.log(
          'TOKEN:',
          token
        );

        if (token) {

          console.log(
            'SAVE TOKEN'
          );

          await this.auth.saveToken(
            token
          );

          console.log(
            'CALL REFRESH USER'
          );

          await this.auth.refreshUser();

          console.log(
            'REFRESH DONE'
          );

          this.router.navigateByUrl(
            '/tabs/home',
            {
              replaceUrl: true
            }
          );

        }

      }

    }
  );  

    }

    async initApp() {
      await this.oneSignal.init();
    }

  }

