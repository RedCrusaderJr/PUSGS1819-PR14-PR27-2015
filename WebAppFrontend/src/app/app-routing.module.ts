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

const routes: Routes = [
    { path: "login"             , component: LoginComponent             },
    { path: "register"          , component: RegisterComponent          },
    { path: "profile"           , component: ProfileComponent           },
    { path: "timetable"         , component: TimetableComponent         },
    { path: "timetable-editor"  , component: TimetableEditorComponent   },
    { path: "bus-lines"         , component: BusLinesComponent          },
    { path: "tickets"           , component: TicketsComponent           },
    { path: "bus-location"      , component: BusLocationComponent       },
    { path: "ticket-validator"  , component: TicketValidatorComponent   },
    { path: "map-builder"       , component: MapBuilderComponent        },
    { path: ''                  , redirectTo: 'home', pathMatch: 'full' },
    { path: '**'                , redirectTo: 'home'                    }
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