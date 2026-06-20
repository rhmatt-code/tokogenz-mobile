import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { addIcons } from 'ionicons';
import { eyeOutline, alertCircleOutline} from 'ionicons/icons';

import { Router } from '@angular/router';

import { IonContent, IonIcon } from '@ionic/angular/standalone';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonIcon
  ],

  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss']
})
export class ResetPasswordPage {

  loading = false;

  showPassword = false;

  showConfirmPassword = false;

  resetForm: FormGroup;

  email = '';

  resetToken = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {

    addIcons({eyeOutline, alertCircleOutline});
    this.email =
      localStorage.getItem('reset_email') || '';

    this.resetToken =
      localStorage.getItem('reset_token') || '';

    if (!this.email || !this.resetToken) {

      this.router.navigateByUrl(
        '/forgot-password'
      );

    }

    this.resetForm = this.fb.group({

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      password_confirmation: [
        '',
        Validators.required
      ]

    }, {
      validators: this.passwordMatchValidator()
    });

  }

  passwordMatchValidator(): ValidatorFn {

    return (
      control: AbstractControl
    ): ValidationErrors | null => {

      const password =
        control.get('password')?.value;

      const confirm =
        control.get(
          'password_confirmation'
        )?.value;

      if (
        password &&
        confirm &&
        password !== confirm
      ) {

        return {
          mismatch: true
        };

      }

      return null;

    };

  }

  togglePassword() {

    this.showPassword =
      !this.showPassword;

  }

  toggleConfirmPassword() {

    this.showConfirmPassword =
      !this.showConfirmPassword;

  }

  resetPassword() {

    if (this.resetForm.invalid) {

      this.resetForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    this.auth.resetPassword({

      email: this.email,

      reset_token: this.resetToken,

      password:
        this.resetForm.value.password,

      password_confirmation:
        this.resetForm.value.password_confirmation

    }).subscribe({

      next: () => {

        this.loading = false;

        localStorage.removeItem(
          'reset_email'
        );

        localStorage.removeItem(
          'reset_token'
        );

        alert(
          'Password berhasil diubah'
        );

        this.router.navigateByUrl(
          '/login',
          {
            replaceUrl: true
          }
        );

      },

      error: (err) => {

        this.loading = false;

        alert(
          err?.error?.message ??
          'Gagal mengubah password'
        );

      }

    });

  }

}