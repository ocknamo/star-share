import { InjectionToken } from '@angular/core';

import { config } from '../config';

export const SWARM_ADDRESSES = new InjectionToken<string[]>(
  'ipfsSwarmAddresses',
  {
    providedIn: 'root',
    factory: (): string[] => config.prod.ipfs.swarmAddresses,
  }
);
