import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../login/login.component';
import { DocProfileComponent } from '../profile/doc.profile.component';
import { PatProfileComponent } from '../profile/pat.profile.component';



const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'profile-doc', component: DocProfileComponent },
  { path: 'profile-pat', component: PatProfileComponent }
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