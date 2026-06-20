import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  async set(key: string, value: any) {
    await Preferences.set({
      key,
      value: JSON.stringify(value)
    });
  }

  async get(key: string) {

    const data = await Preferences.get({
      key
    });

    return data.value
      ? JSON.parse(data.value)
      : null;
  }

  async remove(key: string) {

    await Preferences.remove({
      key
    });

  }

  async clear() {
    await Preferences.clear();
  }

}