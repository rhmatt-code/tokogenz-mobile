import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private api: ApiService
  ) {}

  checkout(data: any) {

    return this.api.post(
      '/orders/checkout',
      data
    );

  }

  getOrders() {

    return this.api.get(
      '/orders'
    );

  }

  history() {
    return this.api.get(
      '/orders'
    );

  }

  detail(id: number) {

    return this.api.get(
      `/orders/${id}`
    );

  }

  paymentStatus(id: number) {

    return this.api.get(
      `/orders/${id}/payment-status`
    );

  }

  expireOrder(id: number) {

    return this.api.post(
      `/orders/${id}/expire`,
      {}
    );

  }

}