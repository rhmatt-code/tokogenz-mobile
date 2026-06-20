import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonContent,
  IonSearchbar,
  IonAvatar,
  IonButton,
  IonIcon,
  IonSpinner,
  AlertController,
  Platform,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  logInOutline,
  chevronBackOutline,
  chevronForwardOutline
} from 'ionicons/icons';

import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    CommonModule,
    IonContent,
    IonSearchbar,
    IonAvatar,
    IonButton,
    IonIcon,
    IonSpinner
  ],

  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {

  user$ = new BehaviorSubject<any>(null);

  isLoading = false;

  searchQuery = '';

  selectedCategory = 'All';

  categories = [
    'All',
    'Fashion',
    'Elektronik',
    'Gaming',
    'Makanan',
    'Aksesoris'
  ];

  products: any[] = [];

  filteredProducts: any[] = [];

  currentPage = 1;

  itemsPerPage = 8;

  totalPages = 1;

  totalPagesArray: number[] = [];
  private backButtonSub: any;

  constructor(
    private auth: AuthService,
    private productService: ProductService,
    private router: Router,
    private alertController: AlertController,
    private platform: Platform
  ) {addIcons({logInOutline,chevronBackOutline,chevronForwardOutline});}
  
  async ngOnInit() {

    await this.loadUser();

    this.loadProducts();

  }


  ionViewWillEnter() {

      this.loadUser();

      this.backButtonSub =
        this.platform.backButton
          .subscribeWithPriority(
            9999,
            async () => {

              const alert =
                await this.alertController.create({

                  header:
                    'Keluar Aplikasi',

                  message:
                    'Apakah Anda yakin ingin keluar?',

                  buttons: [

                    {
                      text: 'Batal',
                      role: 'cancel'
                    },

                    {
                      text: 'Keluar',

                      handler: () => {

                        App.exitApp();

                      }

                    }

                  ]

                });

              await alert.present();

            }
          );

  }

  async loadUser() {

    const user =
      await this.auth.getUser();

    console.log('HOMEEEEED USER: ', user)
    this.user$.next(user);

  }

  loadProducts() {

  this.isLoading = true;

  this.productService
    .getProducts()
    .subscribe({

      next: (res: any) => {

        this.isLoading = false;

        this.products = res.data.map(
          (product: any) => ({

            id: product.id,

            name: product.name,

            description: product.description,

            category:
              product.category ??
              'Lainnya',

            price:
              Number(product.price),

            stock:
              Number(product.stock),

            seller_name:
              product.seller?.name ??
              'Unknown Seller',

            image:
              product.image
                ? `https://tokogenz.campusjaya.site/storage/${product.image}`
                : 'assets/images/no-image.png'

          })
        );

        this.filterProducts();

      },

      error: (err) => {

        this.isLoading = false;

        console.error(err);

      }

    });

}

  onSearchChange(event: any) {

    this.searchQuery =
      event.target.value || '';

    this.currentPage = 1;

    this.filterProducts();

  }

  selectCategory(category: string) {

    this.selectedCategory = category;

    this.currentPage = 1;

    this.filterProducts();

  }

  filterProducts() {

    let result = [...this.products];

    if (this.selectedCategory !== 'All') {

      result = result.filter(
        product =>
          product.category ===
          this.selectedCategory
      );

    }

    if (this.searchQuery) {

      result = result.filter(product =>
        product.name
          .toLowerCase()
          .includes(
            this.searchQuery.toLowerCase()
          )
      );

    }

    this.filteredProducts = result;

    this.setupPagination();

  }

  setupPagination() {

    this.totalPages = Math.ceil(
      this.filteredProducts.length /
      this.itemsPerPage
    );

    if (this.totalPages < 1) {

      this.totalPages = 1;

    }

    this.totalPagesArray =
      Array.from(
        { length: this.totalPages },
        (_, i) => i + 1
      );

  }

  get paginatedProducts() {

    const start =
      (this.currentPage - 1)
      * this.itemsPerPage;

    const end =
      start +
      this.itemsPerPage;

    return this.filteredProducts.slice(
      start,
      end
    );

  }

  goToPage(page: number) {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;

  }

  goToProduct(id: number) {

    this.router.navigate([
      '/product',
      id
    ]);

  }

  login() {

    this.router.navigateByUrl(
      '/login'
    );

  }

}