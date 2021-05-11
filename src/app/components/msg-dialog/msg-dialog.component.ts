import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface MsgDialogData {
  title: string;
  msg: string;
}

export interface MsgDialogResponseData {
  neverShowMeAgain: boolean;
}

@Component({
  selector: 'app-msg-dialog',
  templateUrl: './msg-dialog.component.html',
  styleUrls: ['./msg-dialog.component.scss'],
})
export class MsgDialogComponent {
  neverShowMeAgain = false;

  constructor(
    public dialogRef: MatDialogRef<MsgDialogComponent, MsgDialogResponseData>,
    @Inject(MAT_DIALOG_DATA) public data: MsgDialogData
  ) {}

  close(): void {
    this.dialogRef.close({ neverShowMeAgain: this.neverShowMeAgain });
  }
}
