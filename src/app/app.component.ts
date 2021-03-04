import { Component, Inject, OnInit } from '@angular/core';
import { NgIpfsService } from 'ng-ipfs-service';

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
    await this.ipfsService.start();

    const { id, agentVersion } = await this.ipfsService.get().id();
    this.id = id;
    this.agentVersion = agentVersion;
  }
}
