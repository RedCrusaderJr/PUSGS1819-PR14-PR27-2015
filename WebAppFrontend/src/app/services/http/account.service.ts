import { BaseHttpService } from './base.service';
import { RegistrationModel } from 'src/app/Models/RegistrationModel';
import { Observable } from 'rxjs';

export class AccountService extends BaseHttpService<any> {
    
    register(data: any, options?: any) : Observable<any>{
        this.specificUrl = "/api/Account/Register"
        return super.post(data, options);
    }

    logout () : Observable<any> {
        this.specificUrl = "/api/Account/Logout";
        return super.post({});
    }

    uploadImage(data: any, id: string, options?: any) : Observable<any> {
        this.specificUrl = "/api/Account/UplaodPicture/" + id;
        return super.post(data); 
    }

    changePassword(data: any, options?: any) : Observable<any> {
        this.specificUrl = "/api/Account/ChangePassword";
        return super.post(data);
    }

}