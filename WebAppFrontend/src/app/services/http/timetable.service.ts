import { BaseHttpService } from './base.service';
import { Timetable } from 'src/app/Models/Timetable';

export class TimetableService extends BaseHttpService<Timetable> {
    
    getAllTimetables() {
        this.specificUrl ="/api/Timetables";
        return super.getAll();
    }

    putTimetable(id : boolean, data: Timetable) {
        this.specificUrl = "/api/Timetable/" + id;
        return super.put(data);
    }
}