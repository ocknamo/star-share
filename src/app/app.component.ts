/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject, OnInit } from '@angular/core';
import { IPFSConfig } from 'ipfs-core/src/components';
import { NgIpfsService } from 'ng-ipfs-service';

import { SWARM_ADDRESSES } from './providers/app-config';
import { AppActions } from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = '★ share';
  id = 'loading...';
  agentVersion = 'loading...';

  constructor(
    @Inject(NgIpfsService) private readonly ipfsService: NgIpfsService,
    @Inject(SWARM_ADDRESSES) private readonly swarmAddresses: string[],
    private readonly appActions: AppActions
  ) {}

  async ngOnInit(): Promise<void> {
    // Initialise IPFS node.
    const ipfsConfig: IPFSConfig = {
      Addresses: {
        Swarm: this.swarmAddresses,
      },
      Discovery: {
        MDNS: { Enabled: true, Interval: 10 },
        webRTCStar: { Enabled: true },
      },
    };

    try {
      await this.ipfsService.start({
        config: ipfsConfig,
      });
      const { id, agentVersion } = await (await this.ipfsService.get()).id();
      this.id = id;
      this.agentVersion = agentVersion;
      this.appActions.nodeStarted();
    } catch (error) {
      this.appActions.nodeErrored(
        'IPFS Node could not be started. Please take some time and try again.'
      );
    }
  }
}
