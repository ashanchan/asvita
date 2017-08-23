import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../login/login.component';
import { DocProfileComponent } from '../profile/doc.profile.component';
import { PatProfileComponent } from '../profile/pat.profile.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ConnectComponent } from '../connect/connect.component';
import { ImageComponent } from '../image/image.component';
import { RecordComponent } from '../record/record.component';
import { LogoutComponent } from '../logout/logout.component';


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile-doc', component: DocProfileComponent },
  { path: 'profile-pat', component: PatProfileComponent },
  { path: 'record', component: RecordComponent },
  { path: 'image', component: ImageComponent },
  { path: 'connect', component: ConnectComponent },
  { path: 'logout', component: LogoutComponent }
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