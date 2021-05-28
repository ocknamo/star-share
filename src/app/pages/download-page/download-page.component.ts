import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { File } from 'ipfs-core-types/src/files';
import { NgIpfsService } from 'ng-ipfs-service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
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

// constant
const CID_LENGTH = 46;
const FETCH_TIMEOUT = 60000;
const FILE_NAME_MAX_LENGTH = 50;

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
    private readonly ipfsService: NgIpfsService,
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
      this.appActions.nodeErrored(
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

  private async searchFileByCID(cid: string): Promise<File | void> {
    try {
      const files = (await this.ipfsService.get()).get(cid, {
        timeout: FETCH_TIMEOUT,
      });

      for await (const file of files) {
        if (file.type !== 'file') {
          throw new Error('This is not file.');
        } else {
          return file;
        }
      }
    } catch (error) {
      this.appActions.nodeErrored(
        'I cannot find the file. Please wait for a while and try again.'
      );
    }
  }

  private async prepareForDownload(
    fileContent: AsyncIterable<Uint8Array>,
    cid: string
  ): Promise<void> {
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

      if (!file) {
        return;
      }

      if (isOver2gb(file)) {
        this.setError(
          true,
          'This file is too large to download. Please do not download file over 2GB.'
        );
        return;
      }

      if (isOver100mb(file)) {
        this.dialog
          .open<
            DownloadCautionDialogComponent,
            DownloadCautionDialogData,
            DownloadCautionDialogResponseData
          >(DownloadCautionDialogComponent, {
            data: {
              title: 'Caution!',
              msg: `The file size is probably too large. It is ${floorToDigits(
                biteToGb(file.size),
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
            await this.prepareForDownload(file.content, file.name);
          });
      } else {
        // This file.name is CID.
        await this.prepareForDownload(file.content, file.name);
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
}
