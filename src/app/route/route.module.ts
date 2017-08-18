import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../login/login.component';
import { DocProfileComponent } from '../profile/doc.profile.component';
import { PatProfileComponent } from '../profile/pat.profile.component';
import { ImageComponent } from '../image/image.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'profile-doc', component: DocProfileComponent },
  { path: 'profile-pat', component: PatProfileComponent },
  { path: 'image', component: ImageComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class RouteModule { }