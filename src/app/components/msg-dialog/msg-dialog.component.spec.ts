import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MsgDialogComponent } from './msg-dialog.component';

describe('MsgDialogComponent', () => {
  let component: MsgDialogComponent;
  let fixture: ComponentFixture<MsgDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { title: 'title', msg: 'message' },
        },
        {
          provide: MatDialogRef,
          useValue: { close: jest.fn() },
        },
      ],
      declarations: [MsgDialogComponent],
      imports: [MatCheckboxModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', () => {
    component.close();
    expect(component.dialogRef.close).toBeCalledWith({
      neverShowMeAgain: false,
    });
  });
});
