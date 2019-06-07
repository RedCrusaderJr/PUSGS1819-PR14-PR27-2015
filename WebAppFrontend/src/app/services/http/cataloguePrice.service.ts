import { BaseHttpService } from './base.service';
import { Observable } from 'rxjs';

export class CataloguePriceService extends BaseHttpService<any> {

    getAllCataloguePrice() {
        this.specificUrl = "/api/CataloguePrices/GetPassengerCataloguePrices"
        return this.getAll();
    }

    getAllAdminCataloguePrices() {
        this.specificUrl = "/api/CataloguePrices/GetAdminCataloguePrices";
        return this.getAll();
    }

    updateCataloguePrice(data: any) : Observable<any> {
        this.specificUrl = "/api/CataloguePrices/PutCataloguePrice"
        return this.put(data);
    }

    postCataloguePrice(data: any) : Observable<any>{
        this.specificUrl = "/api/CataloguePrices"
        return this.post(data);
    }

    deleteCatalogue(id : string) : Observable<any> {
        this.specificUrl = "/api/DeleteCataloguePrice";
        return this.delete(id);
    }
}