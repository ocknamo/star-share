import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DownloadCautionDialogData {
  title: string;
  msg: string;
}

export interface DownloadCautionDialogResponseData {
  result: boolean;
}

@Component({
  templateUrl: './download-caution-dialog.component.html',
  styleUrls: ['./download-caution-dialog.component.scss'],
})
export class DownloadCautionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<
      DownloadCautionDialogComponent,
      DownloadCautionDialogResponseData
    >,
    @Inject(MAT_DIALOG_DATA) public data: DownloadCautionDialogData
  ) {}

  onClickOkButton(): void {
    this.close(true);
  }

  onClickNoButton(): void {
    this.close(false);
  }

  close(result: boolean): void {
    this.dialogRef.close({ result });
  }
}
