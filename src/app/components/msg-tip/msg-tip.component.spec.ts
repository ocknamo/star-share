import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MsgTipComponent } from './msg-tip.component';

describe('MsgTipComponent', () => {
  let component: MsgTipComponent;
  let fixture: ComponentFixture<MsgTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MsgTipComponent],
      imports: [NoopAnimationsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
