import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonModal,
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';

import { addIcons } from 'ionicons';

import {
  personOutline,
  bagHandleOutline,
  bagRemoveOutline,
  timeOutline, logInOutline, personAddOutline, logOutOutline } from 'ionicons/icons';

import QRCode from 'qrcode';

import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    IonModal,
    IonButton,
    IonGrid,
    IonCol,
    IonRow,
  ],
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss']
})
export class OrderListPage implements OnInit {

  isLoggedIn = false;
  remainingTime = '';

  expiredAt = '';
  refreshInterval: any = null;
  timerInterval: any = null;
  orders: any[] = [];
  serviceFee = 0;
  filteredOrders: any[] = [];

  isQrModalOpen = false;

  generatedQrImage = '';

  selectedInvoice = '';

  constructor(
    private auth: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {

    addIcons({bagHandleOutline,logOutOutline,personAddOutline,logInOutline,timeOutline,bagRemoveOutline,personOutline});

  }

  async ngOnInit() {

    const user =
      await this.auth.getUser();

    this.isLoggedIn =
      !!user;

    if (
      this.isLoggedIn
    ) {

      this.loadOrders();
      this.startAutoRefresh();

    }

  }

  startAutoRefresh() {

    this.refreshInterval =
      setInterval(() => {

        this.loadOrders();

      }, 15000);

  }

  
  loadOrders() {
    
    this.orderService.getOrders().subscribe({
      next: (res: any) => {
        this.clearAllTimers();
        this.orders =
          res.map(
            (item: any) => {

              const image =
                item.product?.image
                  ? `https://tokogenz.campusjaya.site/storage/${item.product.image}`
                  : 'assets/images/no-image.png';
              const subTotal = Number(item.product.price)
              const qty = item.quantity
              const Fee = 
              this.serviceFee =
                  Math.ceil(  
                    310 +
                    (subTotal * 0.007)
                  );
              const Price = subTotal + Fee;
              const totalPrice = Price * qty;
              return {

                id: item.id,
                productId: item.product?.id,
                invoice: item.transaction?.invoice_number,
                date: item.created_at,
                expiredAt: item.transaction?.expired_at,
                remainingTime:'',
                timerInterval: null,
                status: item.status,
                statusLabel: this.getStatusLabel(item.status),
                totalPrice: totalPrice,
                productName: item.product?.name,
                productImg: image,
                qtyInfo: `${item.quantity} x`,
                qrString: item.transaction?.qr_string,

                isExpanded:
                  false,

                subProducts:
                  [],

                hasActionBtn:
                  item.status !== 'cancelled',

                actionBtnLabel:
                item.status === 'pending'
                  ? 'Bayar'
                : item.status === 'paid'
                  ? 'Menunggu Pengiriman'
                : item.status === 'shipped'
                  ? 'Beli Lagi ?'
                : item.status === 'cancelled'
                  ? 'Beli Lagi ?'
                : 'Lihat Detail',

                actionBtnType:
                  item.status === 'pending'
                    ? 'primary'
                    : 'secondary'

              };

            }
          );

        this.filteredOrders = this.orders;
        this.startAllTimers();

      },

      error: (err: any) => {

        console.error(
          'LOAD ORDER ERROR',
          err
        );

      }

    });

}
  clearAllTimers() {

    this.orders.forEach(
      (order) => {

        if (
          order.timerInterval
        ) {

          clearInterval(
            order.timerInterval
          );

        }

      }
    );

  }

  
  startAllTimers() {

    this.orders.forEach((order) => 
      {
        if (order.status === 'pending'&&order.expiredAt) 
        {
          this.updateTimer(order);
          order.timerInterval = setInterval(() => {this.updateTimer(order);}, 1000);
        }
      }
    );

}

  updateTimer(order: any) {

      console.log('EXPIRED AT:',order.remainingTime);

        if (
          order.status !== 'pending'
        ) {
          clearInterval(
            order.timerInterval
          );
          return;
        }
      const now = Date.now();
      const expired = new Date(
        order.expiredAt.replace(
          ' ',
          'T'
        )
      ).getTime();

      const distance = expired - now;

      if (distance <= 0) {
      order.remainingTime = 'Expired';
      console.log(order.remainingTime)
      order.status =
      'cancelled';

      order.statusLabel =
        'Dibatalkan';

      order.actionBtnLabel =
        'Beli Lagi ?';

      order.actionBtnType =
        'primary';

      order.hasActionBtn =
        true;

      clearInterval(
        order.timerInterval
      );

      if (!order.expireSent) {

        order.expireSent = true;

        this.orderService
          .expireOrder(
            order.id
          )
          .subscribe({

            next: () => {

              console.log(
                'Order expired:',
                order.id
              );

            },

            error: (err: any) => {

              console.error(
                'Expire gagal',
                err
              );

            }

          });

      }

      return;

      }

  const hours =
    Math.floor(
      distance /
      (1000 * 60 * 60)
    );

  const minutes =
    Math.floor(
      (
        distance %
        (1000 * 60 * 60)
      ) /
      (1000 * 60)
    );

  const seconds =
    Math.floor(
      (
        distance %
        (1000 * 60)
      ) / 1000
    );

  order.remainingTime =
    `${hours
      .toString()
      .padStart(2, '0')}:${
      minutes
        .toString()
        .padStart(2, '0')
    }:${
      seconds
        .toString()
        .padStart(2, '0')
    }`;

  }

  getStatusLabel(status: string) {

    switch (status) 
    {
      case 'pending':
        return 'Menunggu Pembayaran';

      case 'paid':
        return 'Sudah Dibayar';

      case 'shipped':
        return 'Barang Terkirim';

      case 'completed':
        return 'Selesai';

      case 'cancelled':
        return 'Dibatalkan';

      default:
        return status;
    }
  }

  formatDate(
    date: string
  ) {

    return new Date(
      date
    ).toLocaleDateString(
      'id-ID',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    );

  }

  async openQr(
    qrString: string,
    invoice: string
  ) {

    this.selectedInvoice =
      invoice;

    this.generatedQrImage =
      await QRCode.toDataURL(
        qrString
      );

    this.isQrModalOpen =
      true;

  }

  handleOrderAction(order: any) {

  // Pending -> tampilkan QRIS
  if (order.status === 'pending') {

    this.openQr(
      order.qrString,
      order.invoice
    );

    return;

  }

  // Repeat Order
  if (
    order.status === 'shipped' ||
    order.status === 'cancelled'
  ) {

    this.router.navigate(
      ['/checkout'],
      {
        queryParams: {
          productId: order.productId,
          quantity: 1
        }
      }
    );

    return;

  }

  // Status lain
  this.router.navigate(
    ['/order-detail', order.id]
  );

}

  ionViewWillLeave() {
     this.orders.forEach(
    order => {

      if (
        order.timerInterval
      ) {

        clearInterval(
          order.timerInterval
        );

      }

    }
  );

  if (
    this.refreshInterval
  ) {

    clearInterval(
      this.refreshInterval
    );

  }

  }

  goToLogin() {

    this.router.navigateByUrl(
      '/login'
    );

  }

}