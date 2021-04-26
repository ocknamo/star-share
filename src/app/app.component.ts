/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject, OnInit } from '@angular/core';
import { NgIpfsService } from 'ng-ipfs-service';
import { IPFSConfig } from 'ipfs-core/src/components';
import { SWARM_ADDRESSES } from './providers/app-config';

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
    @Inject(SWARM_ADDRESSES) private readonly swarmAddresses: string[]
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

    await this.ipfsService.start({
      config: ipfsConfig,
    });

    const { id, agentVersion } = await (await this.ipfsService.get()).id();
    this.id = id;
    this.agentVersion = agentVersion;
  }
}
