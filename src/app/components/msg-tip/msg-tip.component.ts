import { Component, Input, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-msg-tip',
  templateUrl: './msg-tip.component.html',
  styleUrls: ['./msg-tip.component.scss'],
  animations: [
    trigger('insert', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
        animate('1000ms', style({ opacity: 1 })),
        animate('200ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class MsgTipComponent implements OnInit {
  @Input()
  message = 'copied';

  constructor() {}

  ngOnInit(): void {}
}
