import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import OneSignal from 'onesignal-cordova-plugin';

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {

  constructor(
    private router: Router
  ) {}

  async init() {

    OneSignal.initialize(
      '2a672650-a181-45ac-8e8b-e4587efafc56'
    );

    await OneSignal.Notifications
      .requestPermission(true);

    OneSignal.Notifications
      .addEventListener(
        'click',
        (event: any) => {

          console.log(
            'NOTIFICATION CLICK',
            event
          );

          const data =
            event.notification?.additionalData ??
            {};

          if (data.room_id) {

            this.router.navigateByUrl(
              `/live-room/${data.room_id}`
            );

            return;
          }

          if (data.order_id) {

            this.router.navigateByUrl(
              `/order-detail/${data.order_id}`
            );

            return;
          }

          if (data.product_id) {

            this.router.navigateByUrl(
              `/product/${data.product_id}`
            );

            return;
          }

          this.router.navigateByUrl(
            '/tabs/home'
          );

        }
      );

  }

}
