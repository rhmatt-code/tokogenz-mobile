import {
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';

import { StorageService } from '../services/storage.service';

import { from } from 'rxjs';

import { switchMap } from 'rxjs/operators';

import { STORAGE_KEYS } from '../constants/storage.constant';

export const authInterceptor:
HttpInterceptorFn = (req, next) => {

  const storage =
    inject(StorageService);

  return from(

    storage.get(
      STORAGE_KEYS.TOKEN
    )

  ).pipe(

    switchMap((token) => {

      if (token) {

        req = req.clone({

          setHeaders: {

            Authorization:
            `Bearer ${token}`

          }

        });

      }

      return next(req);

    })

  );

};