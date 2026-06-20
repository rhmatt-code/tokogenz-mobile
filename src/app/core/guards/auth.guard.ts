import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import { StorageService } from '../services/storage.service';

import { STORAGE_KEYS } from '../constants/storage.constant';

export const authGuard: CanActivateFn =
async () => {

  const router = inject(Router);

  const storage =
    inject(StorageService);

  const token =
    await storage.get(
      STORAGE_KEYS.TOKEN
    );

  if (!token) {

    router.navigateByUrl(
      '/login'
    );

    return false;
  }

  return true;
};