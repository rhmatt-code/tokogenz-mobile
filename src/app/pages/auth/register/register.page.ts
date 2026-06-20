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

import { Router } from '@angular/router';

import { IonContent } from '@ionic/angular/standalone';

import { AuthService } from '../../../core/services/auth.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent
  ],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {

  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({

      namaToko: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ],

      // Tambahkan control ini untuk checkbox Terms & Conditions 👇
      agreeToTerms: [
        false,
        [
          Validators.requiredTrue // Mengunci agar nilai wajib true (dicentang)
        ]
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

      const confirmPassword =
        control.get('confirmPassword')?.value;

      if (
        password &&
        confirmPassword &&
        password !== confirmPassword
      ) {
        return {
          mismatch: true
        };
      }

      return null;
    };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = {
      name:
        this.registerForm.value.namaToko,
      email:
        this.registerForm.value.email,
      password:
        this.registerForm.value.password,
      password_confirmation:
        this.registerForm.value.confirmPassword
    };

    this.auth.register(payload)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          console.log(
            'REGISTER SUCCESS',
            res
          );

          localStorage.setItem(
            'verify_email',
            this.registerForm.value.email
          );
          this.router.navigate(['/verify-email']);
        },
        error: (err) => {
          this.loading = false;
          console.error(
            'REGISTER ERROR',
            err
          );

          const message =
            err?.error?.message ||
            'Registrasi gagal';

          alert(message);
        }
      });
  }

  onGoogleRegister() {
    console.log(
      'GOOGLE REGISTER'
    );

    Browser.open({
        url:
        'https://tokogenz.campusjaya.site/api/auth/google/redirect'
      });
  }

}