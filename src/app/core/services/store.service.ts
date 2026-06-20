import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    private api: ApiService
  ) {}

  getStore(
    sellerId: number
  ) {

    return this.api.get(
      `/sellers/${sellerId}`
    );

  }

}