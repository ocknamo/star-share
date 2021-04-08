import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIpfsService } from 'ng-ipfs-service';

// interface FileInfo {
//   fileName: string;
// }

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss'],
})
export class UploadPageComponent implements OnInit {
  input: HTMLInputElement;
  file: File;
  fileName: string | null = null;
  cid: string | null = null;
  downloadUrl: string | null = null;

  constructor(
    private readonly el: ElementRef,
    private readonly ipfsService: NgIpfsService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onUploadButtonClick(): void {
    // Initialize input.
    if (this.input) {
      this.input.value = '';
    }
    this.fileName = null;
    this.cid = null;
    this.downloadUrl = null;

    this.input = this.el.nativeElement.querySelector('#file');
    this.input.click();
  }

  async processFile(input: any): Promise<void> {
    this.file = input.files[0];
    this.fileName = this.file.name;

    const ipfs = await this.ipfsService.get();

    // add API
    // Upload file
    const status = await ipfs.add(this.file, { pin: true });

    this.cid = String(status.cid);
    this.downloadUrl = this.getDownloadUrl(this.cid);
  }

  private getDownloadUrl(cid: string) {
    const baseUrl = window.location.origin;

    return `${baseUrl}/#/download?CID=${this.cid}&fileName=${this.fileName}`;
  }
}
