import { BaseHttpService } from './base.service';
import { RegistrationModel } from 'src/app/Models/RegistrationModel';
import { Observable } from 'rxjs';

export class AccountService extends BaseHttpService<RegistrationModel> {
    
    register(data: RegistrationModel) : Observable<any>{
        this.specificUrl = "/api/Account/Register"
        return super.post(data);
    }

    logout () : Observable<any> {
        this.specificUrl = "/api/Account/Logout";
        return super.post({});
    }

}