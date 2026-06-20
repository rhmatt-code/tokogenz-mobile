import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from './profile.service';
import { tap } from 'rxjs';

import { ApiService } from './api.service';

import { StorageService } from './storage.service';

import { STORAGE_KEYS } from '../constants/storage.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
  private api: ApiService,
  private storage: StorageService,
  private profile: ProfileService
  ) {}

  login(data: any) {

    return this.api.post(
      '/login',
      data
    ).pipe(

      tap(async (res: any) => {

        await this.storage.set(
          STORAGE_KEYS.TOKEN,
          res.token
        );

        await this.storage.set(
          STORAGE_KEYS.USER,
          res.user
        );

      })

    );

  }

  register(data: any) {

    return this.api.post(
      '/register',
      data
    );

  }

    async logout() {

        await this.storage.clear();

    }

  async getUser() {

    return await this.storage.get(
      STORAGE_KEYS.USER
    );

  }

  async getToken() {

    return await this.storage.get(
      STORAGE_KEYS.TOKEN
    );

  }

  async refreshUser() {

  try {

    console.log(
      'REFRESH START'
    );

    const response: any =
      await firstValueFrom(
        this.profile.getProfile()
      );

    console.log(
      'PROFILE RESPONSE',
      response
    );

    await this.storage.set(
      STORAGE_KEYS.USER,
      response.user
    );

    console.log(
      'USER SAVED'
    );

    return response.user;

  } catch (e) {

    console.error(
      'REFRESH ERROR',
      e
    );

    return null;

  }

}

  sendOtp(data: any) {

    return this.api.post(
        '/forgot-password',
        data
    );

  }

  verifyOtp(data: any) {

    return this.api.post(
        '/verify-otp',
        data
    );

    }

    resetPassword(data: any) {

    return this.api.post(
        '/reset-password',
        data
    );

    }

    async saveToken(token: string) {

      await this.storage.set(
        STORAGE_KEYS.TOKEN,
        token
      );

    }

    getOrders() {
        return this.api.get(
            '/orders'
        );
    }

    async clearSession() {

    await this.storage.remove(
        'token'
    );

    await this.storage.remove(
        'user'
    );

    }

    saveOneSignal(oneSignalId: string) {
      return this.api.post(
        '/onesignal/save',
        {
          onesignal_id:
            oneSignalId
        }
      );
    }
    getProfile() {
      return this.api.get(
        '/profile'
      );
    }

    updateProfile(data: FormData) {
      
      return this.api.post(
        '/profile/update',
        data
    );
    }
    

}