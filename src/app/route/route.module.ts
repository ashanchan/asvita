import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../login/login.component';
import { ProfileComponent } from '../profile/profile.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ConnectComponent } from '../connect/connect.component';
import { RecordComponent } from '../record/record.component';
import { GraphComponent } from '../graph/graph.component';
import { LogoutComponent } from '../logout/logout.component';
import { AuthGuard } from './../services/auth.guard.service';


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'record', component: RecordComponent, canActivate: [AuthGuard] },
  { path: 'graph', component: GraphComponent, canActivate: [AuthGuard] },
  { path: 'connect', component: ConnectComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] }
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