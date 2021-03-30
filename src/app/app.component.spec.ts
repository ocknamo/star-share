import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIpfsService } from 'ng-ipfs-service';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { ToolbarComponent } from './components';
import { UploadPageComponent } from './pages';
import { MockElementRef } from './test/mock';

describe('AppComponent', () => {
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
      imports: [RouterTestingModule, MatMenuModule],
      declarations: [AppComponent, ToolbarComponent, UploadPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title '★ share'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('★ share');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.title').textContent).toContain('★ Share');
  });
});
