import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Router } from '@angular/router';

import { IonContent } from '@ionic/angular/standalone';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent
  ],

  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss']
})
export class ForgotPasswordPage {

  loading = false;

  forgotForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {

    this.forgotForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]

    });

  }

  sendOtp() {

    if (this.forgotForm.invalid) {

      this.forgotForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    const email =
      this.forgotForm.value.email;

    this.auth.sendOtp({
      email
    }).subscribe({

      next: (res: any) => {

        this.loading = false;

        localStorage.setItem(
          'reset_email',
          email
        );

        this.router.navigateByUrl('/verify-otp');
      
      },

      error: (err) => {

        this.loading = false;

        alert(
          err?.error?.message ??
          'Gagal mengirim OTP'
        );

      }

    });

  }

  goToLogin() {

    // this.router.navigateByUrl(
    //   '/login'
    // );

  }

}