import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOpenOutline } from 'ionicons/icons';

import { CommonModule } from '@angular/common';

import { ApiService }
from '../../../core/services/api.service';

@Component({
  selector: 'app-verify-email',

  standalone: true,

  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon
  ],

  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss']
})
export class VerifyEmailPage {

  email = '';

  loading = false;

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    addIcons({ mailOpenOutline });
    
    this.email =
      localStorage.getItem(
        'verify_email'
      ) || 'KOSONG';
  }

  resendEmail() {

  if (!this.email) {

    alert(
      'Email tidak ditemukan'
    );

    return;

  }

  this.api.post(
    '/email/resend-verification',
    {
      email: this.email
    }
  ).subscribe({

    next: (res:any) => {

      alert(
        res.message ||
        'Email berhasil dikirim ulang'
      );

    },

    error: (err) => {

      alert(
        err?.error?.message ||
        'Gagal mengirim ulang email'
      );

    }

  });

}

  goToLogin() {

    this.router.navigateByUrl(
      '/login'
    );

  }

}