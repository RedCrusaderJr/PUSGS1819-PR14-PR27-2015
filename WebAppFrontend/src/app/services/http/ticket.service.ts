import { BaseHttpService } from './base.service';
import { Observable } from 'rxjs';

export class TicketService extends BaseHttpService<any> {
    buyTicketUnregistred(data : any) : Observable<any> {
        this.specificUrl = "/api/Ticket/PutChangeValidityOfTicket"
        return this.post(data);
    }
}