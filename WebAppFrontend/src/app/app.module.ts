import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { BaseViewComponent } from './base-view/base-view.component';
import { HeaderComponent } from './header/header.component';
import { OptionBarComponent } from './option-bar/option-bar.component';
import { FunctionsBarComponent } from './functions-bar/functions-bar.component';
import { AuthHttpService } from './services/http/auth.service';
import { TokenInerceptor } from './interceptors/token-interceptor';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { TimetableComponent } from './timetable/timetable.component';
import { BusLinesComponent } from './bus-lines/bus-lines.component';
import { TicketsComponent } from './tickets/tickets.component';
import { BusLocationComponent } from './bus-location/bus-location.component';
import { TicketValidatorComponent } from './ticket-validator/ticket-validator.component';
import { MapBuilderComponent } from './map-builder/map-builder.component';
import { TimetableEditorComponent } from './timetable-editor/timetable-editor.component';
import { JwtService } from './services/jwt.service';
import { ValidateUsersComponent } from './validate-users/validate-users.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseViewComponent,
    HeaderComponent,
    OptionBarComponent,
    FunctionsBarComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    TimetableComponent,
    BusLinesComponent,
    TicketsComponent,
    BusLocationComponent,
    TicketValidatorComponent,
    MapBuilderComponent,
    TimetableEditorComponent,
    ValidateUsersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDnihJyw_34z5S1KZXp90pfTGAqhFszNJk'})
  ],
  providers: [AuthHttpService, {provide: HTTP_INTERCEPTORS, useClass: TokenInerceptor, multi:true}, JwtService],
  bootstrap: [AppComponent]
})
export class AppModule { }
