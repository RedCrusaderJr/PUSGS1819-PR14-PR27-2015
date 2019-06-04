import { BaseHttpService } from './base.service';
import { Line } from 'src/app/Models/Line';

export class LineService extends BaseHttpService<Line> {
    
    getAllLines() {
        this.specificUrl ="/api/Lines";
        return super.getAll();
    }

    getLineById(id: string) {
        this.specificUrl="/api/Lines";
        return super.getById(id);
    }
}