import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgIpfsService } from 'ng-ipfs-service';
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
          provide: NgIpfsService,
          useValue: {
            start: () => {},
            get: () => ({
              id: () => ({ id: 'id', agentVersion: 'agentVersion' }),
            }),
          },
        },
      ],
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
