import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface MsgDialogData {
  title: string;
  msg: string;
}

@Component({
  selector: 'app-msg-dialog',
  templateUrl: './msg-dialog.component.html',
  styleUrls: ['./msg-dialog.component.scss'],
})
export class MsgDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: MsgDialogData) {}
}
