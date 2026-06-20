import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonFooter,
  IonSpinner,
  AlertController,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/angular/standalone';


import { addIcons } from 'ionicons';

import {
  arrowBack,
  heart,
  heartOutline,
  star,
  locationOutline,
  bagHandleOutline,
  alertCircleOutline
} from 'ionicons/icons';

import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-detail',

  standalone: true,

  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonFooter,
    IonSpinner,
    IonCol,
    IonGrid,
    IonRow,
  ],

  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss']
})
export class ProductDetailPage {

  product: any = null;

  isLoading = true;

  isFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private auth: AuthService,
    private alertController: AlertController
  ) {

    addIcons({
      arrowBack,
      heart,
      heartOutline,
      star,
      locationOutline,
      bagHandleOutline,
      alertCircleOutline
    });

  }

  ngOnInit() {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadProduct(id);

  }

  loadProduct(id: number) {

    this.isLoading = true;

    this.productService
      .getProduct(id)
      .subscribe({

        next: (res: any) => {

          const p =
            res.data ?? res;

          this.product = {

            ...p,

            images: p.image
              ? `https://tokogenz.campusjaya.site/storage/${p.image}`
              : 'assets/images/no-image.png',

            store: {

              id:
                p.seller?.id,

              name:
                p.seller?.name,

              logo_url:
                p.seller?.logo
                  ? `https://tokogenz.campusjaya.site/storage/${p.seller.logo}`
                  : null,

              location:
                'Indonesia'

            }

          };

          this.isLoading = false;

        },

        error: (err) => {

          console.error(err);

          this.isLoading = false;

        }

      });

  }

  formatRupiah(price: number | string) {

    return new Intl.NumberFormat(
      'id-ID',
      {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
      }
    ).format(Number(price));

  }

  toggleFavorite() {

    this.isFavorite =
      !this.isFavorite;

  }

  goBack() {

    this.router.navigateByUrl(
      '/tabs/home'
    );

  }

  goToStoreProfile(id: number) {

    console.log(
      'Store:',
      id
    );

    // nanti
    // this.router.navigate(['/store', id]);

  }

  async goBuy() {

  const user =
    await this.auth.getUser();

  if (!user?.address) {
    const alert = await this.alertController.create({

      header: 'Alamat Belum Lengkap',

      message:
        'Silakan lengkapi alamat pengiriman terlebih dahulu.',

      buttons: [

        {
          text: 'Nanti'
        },

        {
          text: 'Lengkapi',

          handler: () => {

            this.router.navigateByUrl(
              '/tabs/profile'
            );

          }
        }

      ]

    });

    await alert.present();
  }else{
    this.router.navigate(
      ['/checkout'],
      {
        state: {
          product: this.product
        }
      }
    );
  }
}

goToStore() {

  this.router.navigate([
    '/store',
    this.product.seller_id
  ]);

}
}
