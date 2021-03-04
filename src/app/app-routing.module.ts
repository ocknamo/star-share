import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadPageComponent, UploadPageComponent } from './pages';

const routes: Routes = [
  { path: 'upload', component: UploadPageComponent },
  { path: 'download', component: DownloadPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
