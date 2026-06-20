import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular/standalone';

import {
  addIcons
} from 'ionicons';

import {
  arrowBackOutline,
  searchOutline,
  cartOutline,
  basketOutline,
  alertCircleOutline
} from 'ionicons/icons';

import {
  StoreService
} from '../../../core/services/store.service';

@Component({
  selector: 'app-store-profile',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol
  ],
  templateUrl: './store-profile.page.html',
  styleUrls: ['./store-profile.page.scss']
})
export class StoreProfilePage
implements OnInit {

  sellerId = 0;

  isLoading = true;

  errorMessage = '';

  storeInfo: any = null;

  productList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService
  ) {

    addIcons({
      arrowBackOutline,
      searchOutline,
      cartOutline,
      basketOutline,
      alertCircleOutline
    });

  }

  ngOnInit() {

    this.sellerId =
      Number(
        this.route.snapshot.paramMap.get(
          'id'
        )
      );

    this.loadStore();

  }

  loadStore() {

    this.storeService
      .getStore(
        this.sellerId
      )
      .subscribe({

        next: (res: any) => {
          console.log(
            'STORE RESPONSE:',
            res
          );

          this.storeInfo = {

            id:
              res.id,

            name:
              res.name,

            description:
              res.description,

            logo_url:
              res.logo
                ? `https://tokogenz.campusjaya.site/storage/${res.logo}`
                : null

          };

           this.productList =
            (res.products || []).map(
              (item: any) => ({

                id:
                  item.id,

                title:
                  item.name,

                price:
                  Number(
                    item.price
                  ),

                imageUrl:
                  item.image
                    ? `https://tokogenz.campusjaya.site/storage/${item.image}`
                    : 'assets/images/no-image.png'

              })
            );

          this.isLoading =
            false;

        },

        error: () => {

          this.errorMessage =
            'Gagal memuat toko';

          this.isLoading =
            false;

        }

      });

  }

  goBack() {

    this.router.navigate(
      ['/tabs/home']
    );

  }

  goToProduct(
    id: number
  ) {

    this.router.navigate([
      '/product',
      id
    ]);

  }

  formatRupiah(
    value: number
  ) {

    return new Intl.NumberFormat(
      'id-ID',
      {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
      }
    ).format(value);

  }

  

}