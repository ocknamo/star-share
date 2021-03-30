/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject, OnInit } from '@angular/core';
import { NgIpfsService } from 'ng-ipfs-service';
import { IPFSConfig } from 'ipfs-core/src/components';

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
    @Inject(NgIpfsService) private readonly ipfsService: NgIpfsService
  ) {}

  async ngOnInit(): Promise<void> {
    // Initialise IPFS node.
    const ipfsConfig: IPFSConfig = {
      Addresses: {
        Swarm: [
          // @Todo: Host my self.
          '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
          '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        ],
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
