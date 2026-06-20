import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LiveService {

  constructor(
    private api: ApiService
  ) {}

  getLives() {

    return this.api.get(
      '/live'
    );

  }

  getLive(id: number) {
    return this.api.get(
      `/live/${id}`
    );
  }

}