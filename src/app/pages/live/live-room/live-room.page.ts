import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
  NgZone
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import {
  Database,
  ref,
  push,
  set,
  remove,
  onValue
} from '@angular/fire/database';

import {
  IonContent,
  IonFooter,
  IonToolbar,
  IonInput,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  eyeOutline,
  closeOutline,
  paperPlane,
  bagHandle,
  chevronDownOutline
} from 'ionicons/icons';


import { AuthService } from '../../../core/services/auth.service';
import { LiveService } from '../../../core/services/live.service';
import { ProductService } from '../../../core/services/product.service';


@Component({
  selector: 'app-live-room',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,

    IonContent,
    IonFooter,
    IonToolbar,
    IonInput,
    IonIcon
  ],

  templateUrl: './live-room.page.html',
  styleUrls: ['./live-room.page.scss']
})
export class LiveRoomPage
implements OnInit, OnDestroy {

  @ViewChild(
    'chatContainer'
  )
  chatContainer!: ElementRef;
  liveId!: number;
  live: any;
  user: any = null;

  hostName = '';

  hostAvatar = '';

  viewerCount = 0;

  safeVideoUrl:
    SafeResourceUrl | null = null;

  messages: any[] = [];

  draftMessage = '';

  products: any[] = [];

  pinnedProduct: any = null;
  listenProduct: any = null;

  isProductListOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private auth: AuthService,
    private liveService: LiveService,
    private db: Database,
    private productService: ProductService,
    private zone: NgZone
  ) {

    addIcons({
      eyeOutline,
      closeOutline,
      paperPlane,
      bagHandle,
      chevronDownOutline
    });

  }

  async ngOnInit() {

  console.log('PARAM:',
    this.route.snapshot.paramMap.get('liveId')
  );

  this.user = await this.auth.getUser();

  console.log('USER:', this.user);

  this.liveId = Number(
    this.route.snapshot.paramMap.get('liveId')
  );

  console.log('LIVE ID:', this.liveId);
  this.joinViewer();
  this.listenViewerCount();
  this.loadLive();
  this.listenMessages();
  this.listenPinnedProduct();

}

  ngOnDestroy() {

    this.leaveViewer();

  }


  async joinViewer() {

  console.log('JOIN VIEWER');

  const viewerRef =
    ref(
      this.db,
      `live_rooms/${this.liveId}/viewers/${this.user.id}`
    );

  await set(viewerRef, true);

  console.log('JOIN SUCCESS');

}

  async leaveViewer() {

    if (
      !this.user
    ) {

      return;

    }

    await remove(

      ref(
        this.db,
        `live_rooms/${this.liveId}/viewers/${this.user.id}`
      )

    );

  }

  loadLive() {

  this.liveService
    .getLive(this.liveId)
    .subscribe({

      next: (res: any) => {

        this.live = res;
        console.log(res);
        this.hostName =
          res.seller?.name || 'Store';
        const sellerId = res.seller?.id;
        this.listenProducts(sellerId);
        this.hostAvatar =
          res.seller?.logo || '';

        const url = `https://www.youtube.com/embed/${res.link_embed}?autoplay=1&playsinline=1&enablejsapi=1`;

        console.log('URL:', url);

        this.safeVideoUrl =
          this.sanitizer
            .bypassSecurityTrustResourceUrl(url);

        console.log(
          'SAFE URL:',
          this.safeVideoUrl
        );

      }

    })
  }

  convertYoutubeUrl(
    url: string
  ): string {

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;

    const match =
      url.match(
        regExp
      );

    const videoId =
      match &&
      match[2].length === 11
        ? match[2]
        : '';

    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  }

  listenViewerCount() {

    const viewerRef =
      ref(
        this.db,
        `live_rooms/${this.liveId}/viewers`
      );

    onValue(
      viewerRef,
      snapshot => {

        console.log(
          'VIEWERS:',
          snapshot.val()
        );

        const data =
          snapshot.val();

        this.viewerCount =
          data
            ? Object.keys(data).length
            : 0;

        console.log(
          'COUNT:',
          this.viewerCount
        );

      }
    );

  }

  listenMessages() {

    const msgRef = ref(this.db, `live_rooms/${this.liveId}/messages`);

    onValue(
      msgRef,
      snapshot => {

        const data =
          snapshot.val();

        if (
          !data
        ) {

          this.messages = [];
        
          return;

        }
      
        this.messages = Object.keys(data).map(key => ({id: key, ...data[key], isSeller: data[key].role === "seller"})).sort(
            
          (
              a,
              b
            ) =>
              a.timestamp -
              b.timestamp
          );
        setTimeout(
          () =>
            this.scrollToBottom(),
          100
        );

      }
    );

  }

  async sendMessage() {
    console.log('USER SEND:', this.user);
    if (
      !this.user
    ) {

      return;

    }

    if (
      !this.draftMessage.trim()
    ) {

      return;

    }

    await push(
  ref(this.db, `live_rooms/${this.liveId}/messages`),
  {
    user: this.user.name,

    role: this.user.role ||  'buyer',

    avatar:
      this.user.logo
        ? `https://tokogenz.campusjaya.site/storage/${this.user.logo}`
        : '',

    text:
      this.draftMessage,

    timestamp:
      Date.now()
  }
);

    this.draftMessage =
      '';

  }

  listenPinnedProduct() {

    console.log("INI LIVE ID: ",this.liveId);
    const productRef = ref(this.db,`live_rooms/${this.liveId}/pinned_product`);
    onValue(
      productRef,
      snapshot => {

        this.zone.run(() => {

          this.pinnedProduct =
            snapshot.val();

          console.log(
            'PIN UPDATED',
            this.pinnedProduct
          );

        });

      }
    );
  }

listenProducts(sellerId: number): void {
  console.log(sellerId);
  this.productService
    .getProductsBySeller(
      sellerId
    )
    .subscribe({

      next: (res: any) => {

        const rawProducts =
          res.data ?? [];

        this.products =
          rawProducts.map(
            (item: any) => ({

              id:
                item.id,

              name:
                item.name,

              price:
                item.price,

              image:
                item.image
                  ? `https://tokogenz.campusjaya.site/storage/${item.image}`
                  : 'assets/images/no-image.png'

            })
          );

      },

      error: (err: any) => {

        console.error(
          err
        );

      }

    });

  

}

  buyNow(pinnedProduct: any) {
    this.router.navigateByUrl('/checkout?productId='+ pinnedProduct.id);
  }

  toggleProductList() {

    this.isProductListOpen =
      !this.isProductListOpen;

  }

  closeRoom() {

    this.router.navigateByUrl(
      '/tabs/live'
    );

  }

  scrollToBottom() {

    try {

      const element =
        this.chatContainer
          ?.nativeElement;

      element.scrollTop =
        element.scrollHeight;

    } catch {}

  }

  trackByMessageIndex(
    index: number
  ) {

    return index;

  }

  trackByProductId(
    index: number,
    item: any
  ) {

    return item.id;

  }

  async ionViewWillLeave() {

    await this.leaveViewer();

  }

}