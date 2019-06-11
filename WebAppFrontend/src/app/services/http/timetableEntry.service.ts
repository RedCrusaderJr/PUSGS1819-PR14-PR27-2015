import { BaseHttpService } from './base.service';
import { Observable } from 'rxjs';

export class TimetableEntryService extends BaseHttpService<any> {
    putTimetableEntries(data: any) : Observable<any> {
        this.specificUrl = "/api/PutTimetableEntries";
        return this.put(data);
    }
}