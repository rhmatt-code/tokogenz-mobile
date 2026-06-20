import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  IonContent,
  IonSearchbar,
  IonSpinner,
  IonIcon
} from '@ionic/angular/standalone';

import {
  addIcons
} from 'ionicons';

import {
  eye
} from 'ionicons/icons';

import {
  Database,
  ref,
  onValue
} from '@angular/fire/database';
import { objectVal } from '@angular/fire/database';

import {
  Injector,
  runInInjectionContext
} from '@angular/core';

import { LiveService }
from './../../../core/services/live.service'

@Component({
  selector: 'app-live-list',
  standalone: true,

  imports: [
    CommonModule,
    IonContent,
    IonSearchbar,
    IonSpinner,
    IonIcon
  ],

  templateUrl:
    './live-list.page.html',

  styleUrls: [
    './live-list.page.scss'
  ]
})
export class LiveListPage
implements OnInit, OnDestroy {

  isLoading = false;

  searchQuery = '';

  streams: any[] = [];

  allStreams: any[] = [];

  currentPage = 1;

  itemsPerPage = 6;

  totalPages = 1;

  totalPagesArray: number[] = [];

  private listeners: (() => void)[] = [];

  constructor(
    private liveService: LiveService,
    private router: Router,
    private db: Database,
    private injector: Injector

  ) {

    addIcons({
      eye
    });

  }

  ngOnInit() {

    this.loadLives();

  }

  ngOnDestroy() {

    this.listeners.forEach(
      fn => fn()
    );

  }

  loadLives() {

    this.isLoading = true;

    this.liveService
      .getLives()
      .subscribe({

        next: (
          res: any
        ) => {

          const data =
            res?.data ?? res;
          this.allStreams =
            data.map(
              (
                item: any
              ) => ({
                
                id:
                  item.id,

                judul:
                  item.judul ??
                  item.title,

                thumbnail:
                  item.link_embed
                    ? (
                        item.link_embed.startsWith(
                          'http'
                        )
                          ? item.link_embed
                          : `https://img.youtube.com/vi/${item.link_embed}/hqdefault.jpg`
                      )
                    : 'assets/images/live-placeholder.jpg',

                seller:
                  item.seller,

                viewer_count: 0

              })
            );

          this.listeners.forEach(fn => fn());
          this.listeners = [];
          this.attachViewerCounts();

          this.applyFilter();

          this.isLoading =
            false;

        },

        error: (
          err: any
        ) => {

          console.error(
            err
          );

          this.isLoading =
            false;

        }

      });

  }

  attachViewerCounts() {

  this.allStreams.forEach(stream => {

    runInInjectionContext(
      this.injector,
      () => {

        const viewerRef =
          ref(
            this.db,
            `live_rooms/${stream.id}/viewers`
          );

        const sub =
          objectVal(viewerRef)
          .subscribe(data => {

            stream.viewer_count =
              data
                ? Object.keys(data as any).length
                : 0;

          });

        this.listeners.push(
          () => sub.unsubscribe()
        );

      }
    );

  });

}

  onSearch(
    event: any
  ) {

    this.searchQuery =
      event.target.value || '';

    this.currentPage = 1;

    this.applyFilter();

  }

  applyFilter() {

    let result =
      [...this.allStreams];

    if (
      this.searchQuery
    ) {

      result =
        result.filter(
          stream =>
            stream.judul
              ?.toLowerCase()
              .includes(
                this.searchQuery
                  .toLowerCase()
              )
        );

    }

    this.totalPages =
      Math.ceil(
        result.length /
        this.itemsPerPage
      );

    this.totalPagesArray =
      Array.from(
        {
          length:
            this.totalPages
        },
        (
          _,
          i
        ) => i + 1
      );

    const start =
      (
        this.currentPage - 1
      ) *
      this.itemsPerPage;

    const end =
      start +
      this.itemsPerPage;

    this.streams =
      result.slice(
        start,
        end
      );

  }

  goToPage(
    page: number
  ) {

    if (
      page < 1 ||
      page > this.totalPages
    ) {

      return;

    }

    this.currentPage =
      page;

    this.applyFilter();

  }

  goToLive(liveId: number){
    this.router.navigate(
      [
        '/live-room',
        liveId
      ]
    );
  }

  trackByStreamId(
    index: number,
    item: any
  ) {

    return item.id;

  }

}