import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppComponent } from './app.component';
import { BaseViewComponent } from './base-view/base-view.component';
import { HeaderComponent } from './header/header.component';
import { OptionBarComponent } from './option-bar/option-bar.component';
import { FunctionsBarComponent } from './functions-bar/functions-bar.component';
import { AuthHttpService } from './services/http/auth.service';
import { TokenInerceptor } from './interceptors/token-interceptor';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseViewComponent,
    HeaderComponent,
    OptionBarComponent,
    FunctionsBarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [AuthHttpService, {provide: HTTP_INTERCEPTORS, useClass: TokenInerceptor, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }