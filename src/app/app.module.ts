import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RouteModule } from './route/route.module';


import { LoginComponent } from './login/login.component';
import { DataService } from './services/data.service';
import { HttpService } from './services/http.service';
import { MessageService } from './services/message.service';

import { DocProfileComponent } from './profile/doc.profile.component';
import { PatProfileComponent } from './profile/pat.profile.component';
import { FooterComponent } from './footer/footer.component';
import { RightPanelComponent } from './right/right.component';
import { CenterPanelComponent } from './center/center.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogoutComponent } from './logout/logout.component';
import { ConnectComponent } from './connect/connect.component';
import { RecordComponent } from './record/record.component';
import { UploadComponent } from './upload/upload.component';
import { ManagerComponent } from './manager/manager.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DocProfileComponent,
    PatProfileComponent,
    FooterComponent,
    RightPanelComponent,
    CenterPanelComponent,
    DashboardComponent,
    LogoutComponent,
    ConnectComponent,
    RecordComponent,
    UploadComponent,
    ManagerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouteModule
  ],

  providers: [DataService, HttpService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
