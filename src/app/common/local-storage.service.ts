import { Injectable } from '@angular/core';

import { MockStorage } from '../utils/mock-storage';
import { storageAvailable } from '../utils/storage-available';

export interface KeyValue {
  key: string;
  value: string | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private myStorage: Storage;

  constructor() {
    if (storageAvailable('localStorage')) {
      this.myStorage = window.localStorage;
    } else {
      this.myStorage = new MockStorage();
    }
  }

  set(kv: KeyValue): void {
    this.myStorage.setItem(kv.key, String(kv.value));
  }

  get(key: KeyValue['key']): KeyValue['value'] | null {
    const value = this.myStorage.getItem(key);

    if (value === 'true' || value === 'false') {
      return value === 'false' ? false : true;
    }

    return value;
  }
}
