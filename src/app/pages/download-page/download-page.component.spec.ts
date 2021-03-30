import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgIpfsService } from 'ng-ipfs-service';

import { DownloadPageComponent } from './download-page.component';

describe('DownloadPageComponent', () => {
  let component: DownloadPageComponent;
  let fixture: ComponentFixture<DownloadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
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
      declarations: [DownloadPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
