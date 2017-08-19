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

import { HeaderComponent } from './header/header.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { DocProfileComponent } from './profile/doc.profile.component';
import { PatProfileComponent } from './profile/pat.profile.component';
import { ImageComponent } from './image/image.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    ImageUploadComponent,
    DocProfileComponent,
    PatProfileComponent,
    ImageComponent,
    FooterComponent
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
