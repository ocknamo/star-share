/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject, OnInit } from '@angular/core';
import { Config as IPFSConfig } from 'ipfs-core-types/src/config';
import { AngularIpfsService } from 'angular-ipfs-service';

import { version } from '../../package.json';
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
  appVersion = version;

  constructor(
    @Inject(AngularIpfsService)
    private readonly ipfsService: AngularIpfsService,
    @Inject(SWARM_ADDRESSES) private readonly swarmAddresses: string[],
    private readonly appActions: AppActions
  ) {}

  async ngOnInit(): Promise<void> {
    // Initialize IPFS node.
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
      this.id = 'error';
      this.agentVersion = 'error';
      this.appActions.nodeErred(
        'IPFS Node could not be started. Please wait for a while and try again.'
      );
    }
  }
}
