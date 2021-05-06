import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgIpfsService } from 'ng-ipfs-service';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { MsgDialogComponent, MsgDialogData } from 'src/app/components';
import { AppStore } from 'src/app/store/store';

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
  isNodePreperd = false;

  // Error
  isError = false;
  errorMessage = '';

  // For handle copy tip
  handleCopyTip$ = new Subject<'CID' | 'DOWNLOAD_URL'>();

  onDestroy$ = new Subject();

  constructor(
    private readonly el: ElementRef,
    private readonly ipfsService: NgIpfsService,
    private readonly appStore: AppStore,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.appStore.isNodePreperd
      .pipe(
        filter((v) => v),
        take(1),
        takeUntil(this.onDestroy$)
      )
      .subscribe((v) => (this.isNodePreperd = v));

    this.appStore.isNodeErrored
      .asObservable()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((v) => {
        this.isError = v.status;
        this.errorMessage = v.message;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

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

  downloadUrlCopyButtonClick(): void {
    this.handleCopyTip$.next('DOWNLOAD_URL');
    this.openDialog();
  }

  cidCopyButtonClick(): void {
    this.handleCopyTip$.next('CID');
  }

  private openDialog() {
    this.dialog.open<MsgDialogComponent, MsgDialogData>(MsgDialogComponent, {
      data: {
        title: 'Caution!',
        msg: 'Please keep open this tab until the file downloaded.',
      },
    });
  }

  private getDownloadUrl(cid: string) {
    const baseUrl = window.location.origin;

    return `${baseUrl}/#/download?CID=${this.cid}&fileName=${this.fileName}`;
  }
}
