import { Component, ElementRef, OnInit } from '@angular/core';
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

  constructor(
    private readonly el: ElementRef,
    private readonly ipfsService: NgIpfsService
  ) {}

  ngOnInit(): void {}

  onUploadButtonClick(): void {
    // Initialize input.
    if (this.input) {
      this.input.value = '';
    }
    this.fileName = null;
    this.cid = null;

    this.input = this.el.nativeElement.querySelector('#file');
    this.input.click();
  }

  async processFile(input: any): Promise<void> {
    this.file = input.files[0];
    this.fileName = this.file.name;
    const path = `/${this.fileName}`;

    const ipfs = this.ipfsService.get();

    // // Upload file with MFS API
    // await ipfs.files.write(path, this.file, { create: true });

    // // Get status
    // const status = await ipfs.files.stat(path);

    // this.cid = String(status.cid);

    // add API
    // Upload file
    const status = await ipfs.add(this.file, { pin: true });
    this.cid = String(status.cid);
  }
}
