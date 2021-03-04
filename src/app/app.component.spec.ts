import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIpfsService } from 'ng-ipfs-service';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './components';

describe('AppComponent', () => {
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
      imports: [RouterTestingModule],
      declarations: [AppComponent, ToolbarComponent],
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
