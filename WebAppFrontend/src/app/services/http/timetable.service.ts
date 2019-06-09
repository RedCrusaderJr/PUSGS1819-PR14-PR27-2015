import { BaseHttpService } from './base.service';
import { Timetable } from 'src/app/Models/Timetable';
import { Observable } from 'rxjs';

export class TimetableService extends BaseHttpService<Timetable> {
    
    getAllTimetables() : Observable<any> {
        this.specificUrl ="/api/Timetables";
        return super.getAll();
    }

    putTimetable(id : boolean, data: Timetable) : Observable<any> {
        this.specificUrl = "/api/Timetable/" + id;
        return super.put(data);
    }
}