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

    checkTicket(data: any) : Observable<any> {
        this.specificUrl = "/api/Tickets/ValidateTicket"
        return this.put(data);
    }

    unvalidateTicket(data: any) : Observable<any> {
        this.specificUrl = "/api/Tickets/UnvalidateTicketManualy";
        return this.put(data);
    }

    checkUncheckTicket(data : number) : Observable<any> {
        this.specificUrl = "/api/Tickets/CheckTicket";
        return this.put(data);
    }
}