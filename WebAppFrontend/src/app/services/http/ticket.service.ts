import { BaseHttpService } from './base.service';
import { Observable } from 'rxjs';

export class TicketService extends BaseHttpService<any> {
    buyTicketUnregistred(data : any) : Observable<any> {
        this.specificUrl = "/api/Tickets/BuyTicketUnregistred"
        return this.post(data);
    }

    buyTicket(data : any) : Observable<any> {
        this.specificUrl = "/api/Tickets/AddTicket";
        return this.post(data);
    }
}