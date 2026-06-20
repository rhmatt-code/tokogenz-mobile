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
  selector: 'app-verify-otp',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent
  ],

  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss']
})
export class VerifyOtpPage {

  loading = false;

  otpForm: FormGroup;

  email = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {

    this.email =
      localStorage.getItem(
        'reset_email'
      ) || '';

    this.otpForm = this.fb.group({

      otp: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });

  }

  verifyOtp() {

  if (this.otpForm.invalid) {

    this.otpForm.markAllAsTouched();

    return;

  }

  this.loading = true;

  this.auth.verifyOtp({

    email: this.email,

    otp: this.otpForm.value.otp

  }).subscribe({

    next: (res: any) => {

      this.loading = false;

      console.log(
        'VERIFY OTP SUCCESS',
        res
      );

      localStorage.setItem(
        'reset_token',
        res.reset_token
      );

      this.router.navigateByUrl(
        '/reset-password'
      );

    },

    error: (err) => {

      this.loading = false;

      console.error(
        'VERIFY OTP ERROR',
        err
      );

      alert(
        err?.error?.message ??
        'OTP tidak valid'
      );

    }

  });

}

  backToForgot() {

    this.router.navigate([
      '/forgot-password'
    ]);

  }

}