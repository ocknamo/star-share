import { Injectable } from '@angular/core';

import { AppStore } from './store';

@Injectable({
  providedIn: 'root',
})
export class AppActions {
  constructor(private readonly appStore: AppStore) {}
  // Actions for ipfs
  nodeStarted(): void {
    this.appStore.isNodePrepared.next(true);
  }

  nodeErred(message: string): void {
    this.appStore.isNodeErred.next({ status: true, message });
  }
}
