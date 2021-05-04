import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStore {
  // State of ipfs node.
  readonly isNodePreperd = new BehaviorSubject<boolean>(false);
  readonly isNodeErrored = new BehaviorSubject<{
    status: boolean;
    message: string;
  }>({ status: false, message: 'error!' });
}
