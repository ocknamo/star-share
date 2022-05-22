import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularIpfsService } from 'angular-ipfs-service';

import { MockElementRef } from './../../test/mock';
import { UploadPageComponent } from './upload-page.component';

describe('UploadPageComponent', () => {
  let component: UploadPageComponent;
  let fixture: ComponentFixture<UploadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ElementRef,
          useClass: MockElementRef,
        },
        {
          provide: AngularIpfsService,
          useValue: {
            start: (): void => {},
            get: (): unknown => ({
              id: (): unknown => ({ id: 'id', agentVersion: 'agentVersion' }),
            }),
          },
        },
      ],
      imports: [MatDialogModule],
      declarations: [UploadPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
