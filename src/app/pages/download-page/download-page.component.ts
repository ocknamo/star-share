import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AngularIpfsService } from 'angular-ipfs-service';
import { IPFSEntry } from 'ipfs-core-types/src/root';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {
  CID_LENGTH,
  FETCH_TIMEOUT,
  FILE_NAME_MAX_LENGTH,
} from 'src/app/common/constants';
import {
  DownloadCautionDialogComponent,
  DownloadCautionDialogData,
  DownloadCautionDialogResponseData,
} from 'src/app/components';
import { AppActions } from 'src/app/store/actions';
import { AppStore } from 'src/app/store/store';
import { biteToGb, floorToDigits } from 'src/app/utils/calc-utils';
import { isOver2gb, isOver100mb } from 'src/app/utils/file-size-validation';

import { fileContentToBlobUrl } from './../../utils/convert';

interface DownloadFile {
  fileContent: AsyncIterable<Uint8Array> | null;
  cid: string;
}

@Component({
  templateUrl: './download-page.component.html',
  styleUrls: ['./download-page.component.scss'],
})
export class DownloadPageComponent implements OnInit, OnDestroy {
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
    fileContent: null,
    cid: '',
  };

  // Error
  isError = false;
  errorMessage = '';

  // After download flag
  downloaded = false;

  onDestroy$ = new Subject();

  constructor(
    private readonly ipfsService: AngularIpfsService,
    private readonly route: ActivatedRoute,
    private readonly appActions: AppActions,
    private readonly appStore: AppStore,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.inputValueHandling();
    this.checkUrlQuery();
    this.nodeErrorHandling();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  async onDownloadButtonClick(): Promise<void> {
    if (!this.downloadFile.cid) {
      return;
    }

    // Show loading spinner
    this.loading = true;

    await this.execDownload();

    // Hide loading spinner
    this.loading = false;

    // Downloaded
    this.setDownloaded();
  }

  onReDownloadButtonClick(): void {
    this.downloaded = false;
    this.ngOnDestroy();
    this.ngOnInit();
    this.emitCidInputChange();
  }

  private async execDownload(): Promise<void> {
    // Get inputted file name.
    const fileName = this.fileNameFormControl.value;

    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');

    let url: string;
    try {
      url = await fileContentToBlobUrl(this.downloadFile.fileContent);
    } catch (error) {
      this.appActions.nodeErred(
        `Something is failed. Please try again or retry on more powerful machine.  message: ${error.message}`
      );
      throw new Error(error);
    }

    a.href = url;
    a.download = fileName || this.downloadFile.cid;
    a.click();

    // For clear Memory.
    URL.revokeObjectURL(url);
  }

  private async searchFileByCID(
    cid: string
  ): Promise<{ content: AsyncIterable<Uint8Array>; meta: IPFSEntry } | void> {
    try {
      const ipfsNode = await this.ipfsService.get();

      // Fetch file meta data.
      const fileMetas = ipfsNode.ls(cid, { timeout: FETCH_TIMEOUT });
      let fileMeta: IPFSEntry;

      for await (const meta of fileMetas) {
        if (meta.type !== 'file') {
          throw new Error('This is not file.');
        } else {
          fileMeta = meta;
        }
      }

      // Get content.
      const content = ipfsNode.cat(cid, {
        timeout: FETCH_TIMEOUT,
      });

      return { content, meta: fileMeta };
    } catch (error) {
      this.appActions.nodeErred(
        'I cannot find the file. Please wait for a while and try again.'
      );
    }
  }

  private prepareForDownload(
    fileContent: AsyncIterable<Uint8Array>,
    cid: string
  ): void {
    this.downloadFile = { fileContent, cid };
    this.showDownloadButton = true;
  }

  private inputValueHandling(): void {
    // Subscribe input value and check validation.
    this.cidFormControl.valueChanges.subscribe((v) => {
      this.clearDownloadFile();
      this.showDownloadButton = false;
      this.loading = false;
      if (this.cidFormControl.valid) {
        this.validValue$.next(v);
      }
    });

    // Subscribe valid input value and change loading flag.
    this.validValue$.pipe(debounceTime(300)).subscribe(async (v) => {
      if (!this.appStore.isNodeErred.getValue().status) {
        this.clearError();
      }
      this.loading = true;
      const file = await this.searchFileByCID(v);
      this.loading = false;

      if (!file || !file.content) {
        return;
      }

      if (isOver2gb(file.meta)) {
        this.setError(
          true,
          'This file is too large to download. Please do not download file over 2GB.'
        );
        return;
      }

      if (isOver100mb(file.meta)) {
        this.dialog
          .open<
            DownloadCautionDialogComponent,
            DownloadCautionDialogData,
            DownloadCautionDialogResponseData
          >(DownloadCautionDialogComponent, {
            data: {
              title: 'Caution!',
              msg: `The file size is probably too large. It is ${floorToDigits(
                biteToGb(file.meta.size),
                2
              )} GB.`,
            },
            disableClose: true,
          })
          .beforeClosed()
          .subscribe(async (data) => {
            if (!data.result) {
              this.clearInputs();
              return;
            }
            this.prepareForDownload(file.content, file.meta.name);
          });
      } else {
        // This file.name is CID.
        this.prepareForDownload(file.content, file.meta.name);
      }
    });
  }

  private clearDownloadFile(): void {
    this.downloadFile = { fileContent: null, cid: '' };
  }

  private nodeErrorHandling(): void {
    this.appStore.isNodeErred
      .asObservable()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((v) => {
        this.setError(v.status, v.message);
      });
  }

  private checkUrlQuery(): void {
    const params = this.route.snapshot.queryParams;

    // Check CID param.
    const hasCid = params.CID !== undefined;
    if (hasCid) {
      this.cidFormControl.setValue(params.CID, { emitEvent: true });
    }

    // Check fileName param.
    const hasFileName = params.fileName !== undefined;
    if (hasFileName) {
      this.fileNameFormControl.setValue(params.fileName);
    }
  }

  // Set downloaded state
  private setDownloaded(): void {
    this.clearDownloadFile();
    this.downloaded = true;
  }

  private setError(isError: boolean, message: string): void {
    this.isError = isError;
    this.errorMessage = message;
  }

  private clearError(): void {
    this.isError = false;
    this.errorMessage = '';
  }

  private clearInputs(): void {
    this.cidFormControl.reset();
    this.fileNameFormControl.reset();
  }

  private emitCidInputChange(): void {
    this.cidFormControl.setValue(this.cidFormControl.value, {
      emitEvent: true,
    });
  }
}
