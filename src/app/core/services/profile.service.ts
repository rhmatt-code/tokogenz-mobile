import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private api: ApiService
  ) {}

  getProfile() {
    return this.api.get('/profile');
  }

  updateProfile(data: any) {
    return this.api.post(
      '/profile/update',
      data
    );
  }

}