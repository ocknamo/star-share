import { Injectable } from '@angular/core';

import { AppStore } from './store';

@Injectable({
  providedIn: 'root',
})
export class AppActions {
  constructor(private readonly appStore: AppStore) {}
  // Actions for ipfs
  nodeStarted(): void {
    this.appStore.isNodePreperd.next(true);
  }

  nodeErrored(message: string): void {
    this.appStore.isNodeErrored.next({ status: true, message });
  }
}
