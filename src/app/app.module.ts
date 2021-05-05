import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MsgDialogComponent, ToolbarComponent } from './components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  DownloadPageComponent,
  PageNotFoundComponent,
  UploadPageComponent,
} from './pages';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIpfsModule } from 'ng-ipfs-service';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    UploadPageComponent,
    DownloadPageComponent,
    PageNotFoundComponent,
    MsgDialogComponent,
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
