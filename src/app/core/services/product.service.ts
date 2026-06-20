import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private api: ApiService
  ) {}

  getProducts() {

    return this.api.get(
      '/products'
    );

  }

  getProduct(id: number) {

    return this.api.get(
      `/products/${id}`
    );

  }

  getProductsBySeller(sellerId: number) 
  {
    return this.api.get(
      `/products?seller_id=${sellerId}`
    );

  }

}