import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RouteModule } from './route/route.module';

import { SafeUrlPipe } from './service/safeUrl.pipe';
import { ParserService } from './service/parser.service';
import { DataService } from './service/data.service';

import { HomeComponent } from './section/home/home.component';
import { LoginComponent } from './section/login/login.component';
import { HeaderComponent } from './section/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    SafeUrlPipe,
    HomeComponent,
    HeaderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouteModule
  ],
  providers: [ParserService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
