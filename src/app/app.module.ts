import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgIpfsModule } from 'ng-ipfs-service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  MsgDialogComponent,
  MsgTipComponent,
  ToolbarComponent,
} from './components';
import {
  DownloadPageComponent,
  PageNotFoundComponent,
  UploadPageComponent,
} from './pages';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    UploadPageComponent,
    DownloadPageComponent,
    PageNotFoundComponent,
    MsgDialogComponent,
    MsgTipComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    NgIpfsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
