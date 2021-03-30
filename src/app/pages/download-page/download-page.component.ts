import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgIpfsService } from 'ng-ipfs-service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { fileContentToDataUri } from './../../utils/convert';

// constant
const CID_LENGTH = 46;
const FETCH_TIMEOUT = 20000;

interface DownloadFile {
  dataUri: string;
  name: string;
}

@Component({
  selector: 'app-download-page',
  templateUrl: './download-page.component.html',
  styleUrls: ['./download-page.component.scss'],
})
export class DownloadPageComponent implements OnInit {
  cidFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(CID_LENGTH),
    Validators.minLength(CID_LENGTH),
  ]);

  validValue$ = new Subject<string>();
  loading = false;
  showDownloadButton = false;

  downloadFile: DownloadFile = {
    dataUri: '',
    name: '',
  };

  constructor(private readonly ipfsService: NgIpfsService) {}

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
  }

  onDownloadButtonClick(): void {
    if (!this.downloadFile.dataUri) {
      return;
    }

    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = this.downloadFile.dataUri;
    a.download = this.downloadFile.name;
    a.click();
    this.clearDownloadFile();
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
        await this.prepareForDownload(file.content, file.name);
      }
    }
  }

  private async prepareForDownload(
    fileContent: AsyncIterable<Uint8Array>,
    fileName: string
  ): Promise<void> {
    const uri = await fileContentToDataUri(fileContent);

    this.downloadFile = { dataUri: uri, name: fileName };
    this.showDownloadButton = true;
  }

  private clearDownloadFile() {
    this.downloadFile = { dataUri: '', name: '' };
  }
}
