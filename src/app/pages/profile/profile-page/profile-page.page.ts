import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert
} from '@ionic/angular/standalone';


import { addIcons } from 'ionicons';

import {
  personOutline,
  settingsOutline,
  chevronForward,
  logOutOutline, personCircleOutline, chevronForwardOutline, personAddOutline, logInOutline, readerOutline, shieldCheckmarkOutline} from 'ionicons/icons';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,

  imports: [
    CommonModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonAlert,
    RouterLink
  ],

  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss']
})
export class ProfilePage {

  user: any = null;

  isLoggedIn = false;

  totalOrders = 0;

  alertButtons = [
    {
      text: 'Batal',
      role: 'cancel'
    },
    {
      text: 'Logout',
      role: 'destructive',
      handler: () => {
        this.logout();
      }
    }
  ];

  constructor(
    private auth: AuthService,
    private router: Router
  ) {

    addIcons({personAddOutline,logInOutline,settingsOutline,chevronForwardOutline,logOutOutline,personCircleOutline,personOutline,chevronForward, readerOutline, shieldCheckmarkOutline});

  }

  async ionViewWillEnter() {

    await this.loadProfile();

  }

  async loadProfile() {

    try {

      const user =
        await this.auth.getUser();

      this.user = user;

      this.isLoggedIn =
        !!user;

      if (
        this.isLoggedIn
      ) {

        this.loadOrders();

      }

    } catch (error) {

      console.error(
        'PROFILE ERROR',
        error
      );

      this.isLoggedIn = false;

    }

  }

  loadOrders() {

    this.auth.getOrders()
      .subscribe({

        next: (res: any) => {
          if (
            res
          ) {

            this.totalOrders =
              res.length;

          } else {

            this.totalOrders = 0;

          }

        },

        error: () => {

          this.totalOrders = 0;

        }

      });

  }

  login() {

    this.router.navigateByUrl(
      '/login'
    );

  }

  async logout() {

  try {

    await this.auth.logout();

    this.router.navigateByUrl(
      '/login',
      {
        replaceUrl: true
      }
    );

  } catch (error) {

    console.error(
      'LOGOUT ERROR',
      error
    );

  }

}

}