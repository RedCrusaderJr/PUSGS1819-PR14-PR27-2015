import { Component, OnInit } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { FormBuilder, Validators, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';
import { CataloguePriceService } from '../services/http/cataloguePrice.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
  providers: [JwtService, FormBuilder, CataloguePriceService]
})
export class TicketsComponent implements OnInit {

  constructor(private jwtService: JwtService, private fb: FormBuilder, private cataloguePriceService: CataloguePriceService) { }
  data = null;
  catalogues = [];
  forms: FormGroup[] = [];
  headersArray: boolean[] = [];
  addForm = this.fb.group({
    begin: ["", Validators.required],
    end: ["", Validators.required],
    hour: ["", [Validators.required, Validators.min(0)]],
    day: ["", [Validators.required, Validators.min(0)]],
    month: ["", [Validators.required, Validators.min(0)]],
    year: ["", [Validators.required, Validators.min(0)]]
  });

  addTicketPriceForm = this.fb.group({
    begin: [Date.now, Validators.required],
    end: [Date.now, Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    type: ['Hour', [Validators.required]]
  });

  initiliazeCataloguePrices() {
    if (this.jwtService.getRole() == "Admin") {
      this.cataloguePriceService.getAllAdminCataloguePrices().subscribe(
        retValue => {
          this.catalogues = [];
          this.forms = [];

          let i = 0;
          let numOfEl = 0;
          retValue.forEach(element => {


            if (i == 0) {
              console.log(element.Catalogue.Begin);
              let bbegin = element.Catalogue.Begin.split("T")[0];
              let eend = element.Catalogue.End.split("T")[0];
              console.log(bbegin);
              numOfEl = this.forms.push(this.fb.group(
                {
                  begin: [bbegin, Validators.required],
                  end: [eend, Validators.required]
                }

              ));
            }


            let ticketType = element.TicketTypeId.toLowerCase();

            switch (ticketType) {
              case "hour":
                {
                  this.forms[numOfEl - 1].addControl("hour", new FormControl(element.Price, Validators.required))
                  break;
                }
              case "day":
                this.forms[numOfEl - 1].addControl("day", new FormControl(element.Price, Validators.required))
                break;
              case "month":
                this.forms[numOfEl - 1].addControl("month", new FormControl(element.Price, Validators.required))
                break;
              case "year":
                this.forms[numOfEl - 1].addControl("year", new FormControl(element.Price, Validators.required))
                break;
            }

            i++;
            if (i == 4) {
              i = 0;
              numOfEl = 0;
              this.catalogues.push(element);
              this.headersArray.push(false);
              console.log("Catalogue: ");
              console.log(this.catalogues);
            }

          })

        },
        err => console.log(err)
      )
    }
  }

  ngOnInit() {
    this.cataloguePriceService.getAllCataloguePrice().subscribe(
      retValue => {
        console.log(retValue);
        if (retValue.length > 0) {
          this.data = {};
          this.data.Begin = retValue[0].Catalogue.Begin;
          this.data.End = retValue[0].Catalogue.End;
          this.data[retValue[0].TicketTypeId] = retValue[0].Price;
          this.data[retValue[1].TicketTypeId] = retValue[1].Price;
          this.data[retValue[2].TicketTypeId] = retValue[2].Price;
          this.data[retValue[3].TicketTypeId] = retValue[3].Price;

        }
        else {
          this.data = null;
        }
      },
      error => console.log(error)
    );

    this.initiliazeCataloguePrices();

  }

  onSubmitUpdate(i: number) {
    console.log(this.catalogues);
    console.log(i);
    console.log(this.catalogues[i]);
    let sendData = {
      begin: this.forms[i].get('begin').value,
      end: this.forms[i].get('end').value,
      hourPrice: this.forms[i].get('hour').value,
      dayPrice: this.forms[i].get('day').value,
      monthPrice: this.forms[i].get('month').value,
      yearPrice: this.forms[i].get('year').value,
      hourId: this.catalogues[i].CatalogueId + "|Hour",
      dayId: this.catalogues[i].CatalogueId + "|Day",
      monthId: this.catalogues[i].CatalogueId + "|Month",
      yearId: this.catalogues[i].CatalogueId + "|Year"
    }

    console.log(sendData);
    this.cataloguePriceService.updateCataloguePrice(sendData).subscribe(data => {
      this.initiliazeCataloguePrices();
    }, err => console.log(err))
  }

  addFormOpen: boolean = false;
  onAddClick() {
    this.addFormOpen = !this.addFormOpen;
  }

  onSubmitAdd() {
    let sendData = {
      begin: this.addForm.get('begin').value,
      end: this.addForm.get('end').value,
      hourPrice: this.addForm.get('hour').value,
      dayPrice: this.addForm.get('day').value,
      monthPrice: this.addForm.get('month').value,
      yearPrice: this.addForm.get('year').value,
    }

    this.cataloguePriceService.postCataloguePrice(sendData).subscribe(
      data => {
        this.initiliazeCataloguePrices();
        this.addForm.reset();
        this.addFormOpen = false;
      },
      error => console.log(error)
    );

  }

  onHeaderClick(index: any) {
    if (this.headersArray[index] == false || this.headersArray[index] == undefined) {
      this.headersArray[index] = true;
    }
    else {
      this.headersArray[index] = false;
    }
  }

  onDeleteCatalogue(index: string) {
    let id = this.catalogues[index].CatalogueId;
    this.cataloguePriceService.deleteCatalogue(id).subscribe(
      data => {
        console.log(data);
        this.initiliazeCataloguePrices();
      },
      err => {
        console.log(err);
      }
    )
  }

}
