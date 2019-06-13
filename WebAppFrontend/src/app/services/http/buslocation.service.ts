import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from 'rxjs';

declare var $;

@Injectable()
export class BusLocationsService {
    private proxy: any;
    private proxyName: string = 'busLocation';
    private connection: any;
    public connectionExists: Boolean;

    public busAdded : EventEmitter<any>;
    public busDeleted : EventEmitter<any>;
    public busMoved : EventEmitter<any>;

    constructor() {
        this.busAdded = new EventEmitter<any>();
        this.busDeleted = new EventEmitter<any>();
        this.busMoved = new EventEmitter<any>();

        this.connection = $.hubConnection("http://localhost:52295/");
        this.connection.qs = {"token" : "Bearer " + localStorage.jwt}

        this.proxy = this.connection.createHubProxy(this.proxyName);
    }

    public startConnection() : Observable<Boolean> {
        return Observable.create((observer) =>{
            this.connection.start()
            .done((data: any) =>{
                console.log("Now connected " + data.transport.name + ', connection ID= ' + data.id)
                this.connectionExists = true;

                observer.next(true);
                observer.complete();
            })
            .fail((error: any) => {
                console.log("Could not connect " + error);
                this.connectionExists = false;

                observer.next(false);
                observer.complete();
            });
        });
    }


}