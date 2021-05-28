import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DownloadCautionDialogComponent } from './download-caution-dialog.component';

describe('DownloadCautionDialogComponent', () => {
  let component: DownloadCautionDialogComponent;
  let fixture: ComponentFixture<DownloadCautionDialogComponent>;

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
      declarations: [DownloadCautionDialogComponent],
      imports: [MatCheckboxModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadCautionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', () => {
    component.close(true);
    expect(component.dialogRef.close).toBeCalledWith({
      result: true,
    });
  });
});
