import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  DownloadPageComponent,
  PageNotFoundComponent,
  UploadPageComponent,
} from './pages';

const routes: Routes = [
  { path: 'upload', component: UploadPageComponent },
  { path: 'download', component: DownloadPageComponent },
  { path: '', redirectTo: 'upload', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
