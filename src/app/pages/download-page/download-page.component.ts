import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgIpfsService } from 'ng-ipfs-service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { fileContentToDataUri } from './../../utils/convert';

// constant
const CID_LENGTH = 46;
const FETCH_TIMEOUT = 20000;
const FILE_NAME_MAX_LENGTH = 50;

interface DownloadFile {
  dataUri: string;
  cid: string;
}

@Component({
  selector: 'app-download-page',
  templateUrl: './download-page.component.html',
  styleUrls: ['./download-page.component.scss'],
})
export class DownloadPageComponent implements OnInit {
  // For CID form.
  cidFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(CID_LENGTH),
    Validators.minLength(CID_LENGTH),
  ]);

  // For file name form.
  fileNameFormControl = new FormControl('', [
    Validators.maxLength(FILE_NAME_MAX_LENGTH),
  ]);

  validValue$ = new Subject<string>();
  loading = false;
  showDownloadButton = false;

  downloadFile: DownloadFile = {
    dataUri: '',
    cid: '',
  };

  constructor(
    private readonly ipfsService: NgIpfsService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cidFormControl.valueChanges.subscribe((v) => {
      this.clearDownloadFile();
      this.showDownloadButton = false;
      this.loading = false;
      if (this.cidFormControl.valid) {
        this.validValue$.next(v);
      }
    });

    this.validValue$.pipe(debounceTime(300)).subscribe(async (v) => {
      this.loading = true;
      await this.handleCID(v);
      this.loading = false;
    });

    this.checkUrlQuery();
  }

  onDownloadButtonClick(): void {
    if (!this.downloadFile.dataUri) {
      return;
    }
    // Get inputed file name.
    const fileName = this.fileNameFormControl.value;

    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = this.downloadFile.dataUri;
    a.download = fileName || this.downloadFile.cid;
    a.click();
  }

  private async handleCID(cid: string): Promise<void> {
    // @TODO: Error handring and messageing.
    const files = (await this.ipfsService.get()).get(cid, {
      timeout: FETCH_TIMEOUT,
    });

    for await (const file of files) {
      if (file.type !== 'file') {
        throw new Error('This is not file.');
      } else {
        // This file.name is CID.
        await this.prepareForDownload(file.content, file.name);
      }
    }
  }

  private async prepareForDownload(
    fileContent: AsyncIterable<Uint8Array>,
    cid: string
  ): Promise<void> {
    const uri = await fileContentToDataUri(fileContent);

    this.downloadFile = { dataUri: uri, cid };
    this.showDownloadButton = true;
  }

  private clearDownloadFile() {
    this.downloadFile = { dataUri: '', cid: '' };
  }

  private checkUrlQuery() {
    const params = this.route.snapshot.queryParams;

    const hasCid = params.CID !== undefined;
    if (hasCid) {
      this.cidFormControl.setValue(params.CID, { emitEvent: true });
    }

    const hasfileName = params.fileName !== undefined;
    if (hasfileName) {
      this.fileNameFormControl.setValue(params.fileName);
    }
  }
}
