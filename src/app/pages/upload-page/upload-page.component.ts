import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularIpfsService } from 'angular-ipfs-service';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/common/local-storage.service';
import {
  MsgDialogComponent,
  MsgDialogData,
  MsgDialogResponseData,
} from 'src/app/components';
import { AppStore } from 'src/app/store/store';
import { biteToGb, floorToDigits } from 'src/app/utils/calc-utils';
import { isOver2gb } from 'src/app/utils/file-size-validation';
import { getDownloadUrl } from 'src/app/utils/get-download-url';

// Key for local storage.
const dontShowDialogKeepOpenTab = 'DONT_SHOW_DIALOG_KEEP_OPEN_TAB';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss'],
})
export class UploadPageComponent implements OnInit, OnDestroy {
  input: HTMLInputElement;
  file: File;
  fileName: string | null = null;
  cid: string | null = null;
  downloadUrl: string | null = null;
  isNodePrepared = false;

  // Error
  isError = false;
  errorMessage = '';

  // For handle copy tip
  handleCopyTip$ = new Subject<'CID' | 'DOWNLOAD_URL'>();

  // Show spinner when uploading file.
  loading = false;

  onDestroy$ = new Subject();

  constructor(
    private readonly el: ElementRef,
    private readonly ipfsService: AngularIpfsService,
    private readonly appStore: AppStore,
    private readonly dialog: MatDialog,
    private readonly storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.nodeErrorHandling();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  onUploadButtonClick(): void {
    this.clearInput();
    this.clearError();
    this.input = this.el.nativeElement.querySelector('#file');
    this.input.click();
  }

  async processFile(input: any): Promise<void> {
    this.file = input.files[0];

    if (isOver2gb(this.file)) {
      this.clearInput();
      this.setError(
        true,
        `Too big to upload. Please do not upload file over 2GB. This size: ${floorToDigits(
          biteToGb(this.file.size),
          2
        )} GB`
      );

      return;
    }

    this.fileName = this.file.name;

    const ipfs = await this.ipfsService.get();

    // Show loading spinner
    this.loading = true;

    // add API
    // Upload file and pin.
    const status = await ipfs.add(this.file, { pin: true });

    this.cid = String(status.cid);
    const baseUrl = window.location.origin;
    this.downloadUrl = getDownloadUrl(baseUrl, this.cid, this.fileName);

    // Hide loading spinner
    this.loading = false;
  }

  downloadUrlCopyButtonClick(): void {
    this.handleCopyTip$.next('DOWNLOAD_URL');
    this.openDialog();
  }

  cidCopyButtonClick(): void {
    this.handleCopyTip$.next('CID');
  }

  private clearInput(): void {
    // clear input.
    if (this.input) {
      this.input.value = '';
    }
    this.fileName = null;
    this.cid = null;
    this.downloadUrl = null;
  }

  private setError(isError: boolean, message: string): void {
    this.isError = isError;
    this.errorMessage = message;
  }

  private clearError(): void {
    this.isError = false;
    this.errorMessage = '';
  }

  private openDialog(): void {
    if (this.storage.get(dontShowDialogKeepOpenTab)) {
      return;
    }

    this.dialog
      .open<MsgDialogComponent, MsgDialogData, MsgDialogResponseData>(
        MsgDialogComponent,
        {
          data: {
            title: 'Caution!',
            msg: 'Please keep open this tab until the file downloaded.',
          },
        }
      )
      .beforeClosed()
      .subscribe((data) => {
        this.storage.set({
          key: dontShowDialogKeepOpenTab,
          value: data.neverShowMeAgain,
        });
      });
  }

  private nodeErrorHandling(): void {
    this.appStore.isNodePrepared
      .pipe(
        filter((v) => v),
        take(1),
        takeUntil(this.onDestroy$)
      )
      .subscribe((v) => (this.isNodePrepared = v));

    this.appStore.isNodeErred
      .asObservable()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((v) => {
        this.setError(v.status, v.message);
      });
  }
}
