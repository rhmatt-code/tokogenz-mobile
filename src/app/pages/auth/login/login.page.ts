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
  import { Browser } from '@capacitor/browser';
  import { AuthService } from '../../../core/services/auth.service';
  import OneSignal from 'onesignal-cordova-plugin';


  @Component({
    selector: 'app-login',

    standalone: true,

    imports: [
      CommonModule,
      ReactiveFormsModule,
      IonContent
    ],

    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
  })
  export class LoginPage {

    loginForm!: FormGroup;

    showPassword = false;

    loading = false;

    constructor(
      private fb: FormBuilder,
      private auth: AuthService,
      private router: Router
    ) {

      this.loginForm = this.fb.group({

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
        ]

      });

    }

    togglePassword() {

      this.showPassword =
        !this.showPassword;

    }

    onLogin() {

      if (this.loginForm.invalid) {

        this.loginForm.markAllAsTouched();

        return;

      }

      this.loading = true;

      this.auth.login(
        this.loginForm.value
      ).subscribe({

        next: async (res: any) => {

          this.loading = false;
          await this.auth.refreshUser();
          if (
            res.email_verified === false
          ) {

            const inputEmail =
              this.loginForm.value.email;

            localStorage.setItem(
              'verify_email',
              inputEmail
            );

            this.router.navigateByUrl(
              '/verify-email',
              {
                replaceUrl: true
              }
            );

            return;
          }

          setTimeout(() => {

            const oneSignalId =
              OneSignal.User
                .pushSubscription
                .id;

            console.log(
              'ONESIGNAL ID:',
              oneSignalId
            );

            if (oneSignalId) {

              this.auth
                .saveOneSignal(
                  oneSignalId
                )
                .subscribe();

            }

          }, 3000);

          this.router.navigateByUrl(
            '/tabs/home',
            {
              replaceUrl: true
            }
          );

        },

        error: (err) => {

          this.loading = false;

          console.error(
            'LOGIN ERROR',
            err
          );

          alert(
            err?.error?.message ??
            'Login gagal'
          );

        }

      });

    }


    goToForgotPassword() {

      this.router.navigateByUrl(
        '/forgot-password'
      );

    }

    onGoogleLogin() {

      console.log(
        'Google Login'
      );
      Browser.open({
        url:
        'https://tokogenz.campusjaya.site/api/auth/google/redirect'
      });

      

    }

  }