import { BaseHttpService } from './base.service';
import { Line } from 'src/app/Models/Line';
import { Observable } from 'rxjs';

export class LineService extends BaseHttpService<Line> {
    
    getAllLines() : Observable<any> {
        this.specificUrl ="/api/Lines";
        return super.getAll();
    }

    getLineById(id: string) : Observable<any> {
        this.specificUrl="/api/Lines";
        return super.getById(id);
    }

    postLine(data: Line) : Observable<any> {
        this.specificUrl="/api/Lines";
        return super.post(data);
    }

    startHub() : Observable<any> {
        this.specificUrl = "/api/Lines/StartHub";
        return super.get();
    }

    putLine(id : string, data: Line) : Observable<any> {
        this.specificUrl="/api/Lines/" + id;
        return super.put(data);
    }

    deleteLine(id: string) : Observable<any> {
        this.specificUrl="/api/Lines";
        return super.delete(id);
    }

}