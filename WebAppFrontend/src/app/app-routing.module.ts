import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { TimetableComponent } from './timetable/timetable.component';
import { BusLinesComponent } from './bus-lines/bus-lines.component';
import { TicketsComponent } from './tickets/tickets.component';
import { BusLocationComponent } from './bus-location/bus-location.component';
import { MapBuilderComponent } from './map-builder/map-builder.component';
import { TicketValidatorComponent } from './ticket-validator/ticket-validator.component';
import { TimetableEditorComponent } from './timetable-editor/timetable-editor.component';
import { AdminGuard } from './guards/admin.guard';
import { ValidateUsersComponent } from './validate-users/validate-users.component';
import { ControllerGuard } from './guards/controller.guard';
import { TokenGuard } from './guards/token.guard';

const routes: Routes = [
    { path: "login"             , component: LoginComponent                                                         },
    { path: "register"          , component: RegisterComponent                                                      },
    { path: "profile"           , component: ProfileComponent         , canActivate: [TokenGuard]                   },
    { path: "timetable"         , component: TimetableComponent                                                     },
    { path: "timetable-editor"  , component: TimetableEditorComponent , canActivate: [TokenGuard, AdminGuard]       },
    { path: "bus-lines"         , component: BusLinesComponent        , canActivate: [TokenGuard]                   },
    { path: "map-builder"       , component: MapBuilderComponent      , canActivate: [TokenGuard, AdminGuard]       },
    { path: "tickets"           , component: TicketsComponent         , canActivate: [TokenGuard]                   },
    { path: "bus-location"      , component: BusLocationComponent     , canActivate: [TokenGuard]                   },
    { path: "ticket-validator"  , component: TicketValidatorComponent , canActivate: [TokenGuard, ControllerGuard]  },
    { path: "validate-users"    , component: ValidateUsersComponent   , canActivate: [TokenGuard, ControllerGuard]  },
    { path: ''                  , redirectTo: 'timetable', pathMatch: 'full'                                        },
    { path: '**'                , redirectTo: 'timetable'                                                           },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}


      // children: [
      //   { path: 'wd',
      //     component: TimeTableDayComponent,
      //   },
      //   {
      //     path: 'sut',
      //     component: TimeTableDayComponent,
      //   },
      //   {
      //     path: 'sun',
      //     component: TimeTableDayComponent,
      //   }
      // ]