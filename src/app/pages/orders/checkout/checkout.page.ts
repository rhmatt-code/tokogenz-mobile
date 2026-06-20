import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonTitle,
  IonContent,
  IonFooter,
  IonIcon,
  IonGrid,
  IonCol,
  IonRow
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  bagCheckOutline,
  locationOutline,
  receiptOutline
} from 'ionicons/icons';

import QRCode from 'qrcode';

import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-checkout',

  standalone: true,

  imports: [
    CommonModule,

    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
    IonTitle,
    IonContent,
    IonFooter,
    IonIcon,
    IonGrid,
    IonCol,
    IonRow
  ],

  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss']
})
export class CheckoutPage implements OnInit {

  product: any = null;
  address: any = null;
  subtotal = 0;
  serviceFee = 0;
  totalPayment = 0;
  isSubmitting = false;
  invoiceNumber = '';
  qrString = '';
  qrImage = '';
  orderId = 0;
  transactionStatus = 'pending';
  interval: any;
  expiredAt = '';
  remainingTime = '';
  timerInterval: any;
  paymentExpired = false;
  quantity = 1;


  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {

    addIcons({
      bagCheckOutline,
      locationOutline,
      receiptOutline
    });

    const nav =
      this.router.getCurrentNavigation();

    this.product =
      nav?.extras.state?.['product'];

  }

  ngOnInit() {
    console.log("INI PRODUCT",this.product);
    this.loadAddress();

    if (this.address?.address) 
    {

      this.router.navigateByUrl('/tabs/profile');
      return;

    }
    
    if (this.product) {

      this.subtotal =
        Number(this.product.price);

      this.serviceFee =
        Math.ceil(  
          310 +
          (this.subtotal * 0.007)
        );

      this.totalPayment =
        this.subtotal +
        this.serviceFee;

    }

     this.route.queryParams.subscribe(
      params => {

        const productId =
          Number(
            params['productId']
          );

        this.quantity =
          Number(
            params['quantity'] || 1
          );

        if (productId) {

          this.loadProduct(
            productId
          );

        }

      }
    );

     

  }

  loadProduct(productId: number) {

  this.productService
    .getProduct(productId)
    .subscribe({

      next: (res: any) => {

        this.product = res;
        console.log("INI IMAGEs",this.product.images);
        this.product.images = `https://tokogenz.campusjaya.site/storage/${res.image}`;

        this.subtotal =
          Number(res.price) * this.quantity;

        this.serviceFee =
          Math.ceil(
            310 +
            (this.subtotal * 0.007)
          );

        this.totalPayment =
          this.subtotal +
          this.serviceFee;

      },

      error: (err) => {

        console.error(
          'Gagal load product',
          err
        );

      }

    });

}

  ionViewWillLeave() {

    clearInterval(
      this.interval
    );

    clearInterval(
      this.timerInterval
    );

  }

  async loadAddress() {

    const user = await this.authService.getUser();

    this.address = {

      name:
        user.name,

      address:
        user.address || ''

    };

  }

  formatRupiah(
    value: number | string
  ) {

    return new Intl.NumberFormat(
      'id-ID',
      {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
      }
    ).format(
      Number(value)
    );

  }

  async placeOrder() {

    if (!this.product) {

      return;

    }

    this.isSubmitting = true;

    this.orderService
      .checkout({

        product_id:
          this.product.id,

        quantity: this.quantity

      })
      .subscribe({

        next: async (res: any) => {

          console.log(
            'CHECKOUT SUCCESS',
            res
          );

          this.isSubmitting = false;

          this.orderId =
            res.order_id;

          this.invoiceNumber =
            res.invoice_number;

          this.expiredAt =
            res.payment
              ?.payment
              ?.expired_at;

          this.qrString =
            res.payment
              ?.payment
              ?.payment_number || '';

          this.serviceFee =
            res.payment.payment.fee;

          this.totalPayment =
            res.payment
              ?.payment
              ?.total_payment
            ?? this.totalPayment;

          await this.generateQr();
          this.startCountdown();
          this.startCheckingPayment();

        },

        error: (err) => {

          console.error(
            'CHECKOUT ERROR',
            err
          );

          this.isSubmitting = false;

          alert(
            err?.error?.message ??
            'Checkout gagal'
          );

        }

      });

  }

  async generateQr() {

    try {

      this.qrImage =
        await QRCode.toDataURL(
          this.qrString
        );

    } catch (error) {

      console.error(
        'QR ERROR',
        error
      );

    }

  }

  startCountdown() {

    if (!this.expiredAt) {

      return;

    }

    this.updateRemainingTime();

    this.timerInterval =
      setInterval(() => {

        this.updateRemainingTime();

      }, 1000);

  }

  updateRemainingTime() {

    const now =
      new Date().getTime();

    const expired =
      new Date(
        this.expiredAt
      ).getTime();

    const distance =
      expired - now;

    if (distance <= 0) {

      this.remainingTime =
        '00:00';

      this.paymentExpired = true;

      clearInterval(
        this.timerInterval
      );

      clearInterval(
        this.interval
      );

      return;

    }

    const minutes =
      Math.floor(
        distance / 1000 / 60
      );

    const seconds =
      Math.floor(
        (distance / 1000) % 60
      );

    this.remainingTime =
      `${minutes
        .toString()
        .padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;

  }

  startCheckingPayment() {

    if (this.interval) {

      clearInterval(
        this.interval
      );

    }

    this.interval =
      setInterval(() => {

        this.checkPayment();

      }, 5000);

  }

  decreaseQty() {

    if (this.quantity > 1) {

      this.quantity--;

      this.calculatePrice();

    }

  }

  increaseQty() {

  if (
    !this.product
  ) {

    return;

  }

  if (
    this.quantity >= this.product.stock
  ) {

    return;

  }

  this.quantity++;

  this.calculatePrice();

}

  calculatePrice() {

  this.subtotal =
    Number(this.product.price) *
    this.quantity;

  this.serviceFee =
    Math.ceil(
      310 +
      (this.subtotal * 0.007)
    );

  this.totalPayment =
    this.subtotal +
    this.serviceFee;

} 
  checkPayment() {

    if (!this.orderId) {

      return;

    }

    this.orderService
      .paymentStatus(
        this.orderId
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'PAYMENT STATUS',
            res
          );

          this.transactionStatus =
            res.transaction_status;

          if (
            res.order_status === 'paid'
          ) {

            clearInterval(
              this.interval
            );

            alert(
              'Pembayaran berhasil'
            );

            this.router.navigateByUrl(
              '/order-list',
              {
                replaceUrl: true
              }
            );

          }

        },

        error: (err) => {

          console.error(
            'STATUS ERROR',
            err
          );

        }

      });

  }

}