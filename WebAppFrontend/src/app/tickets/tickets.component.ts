import { Component, OnInit } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { FormBuilder, Validators, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';
import { CataloguePriceService } from '../services/http/cataloguePrice.service';
import { formatDate } from '@angular/common';
import { TicketService } from '../services/http/ticket.service';
import { AccountService } from '../services/http/account.service';
import { PassengerService } from '../services/http/passenger.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
  providers: [JwtService, FormBuilder, CataloguePriceService, TicketService, PassengerService]
})
export class TicketsComponent implements OnInit {

  constructor(private jwtService: JwtService, private passengerService : PassengerService, private fb: FormBuilder, private cataloguePriceService: CataloguePriceService, private ticketService : TicketService) { }
  data = null;
  user = null;
  selectedTicketType = null;
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

  emailForm = this.fb.group({
    emailAddress: ["", [Validators.required, Validators.email]]
  })

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
          this.data.CatalogueId = retValue[0].CatalogueId;

        }
        else {
          this.data = null;
        }
      },
      error => console.log(error)
    );

    this.passengerService.getPassenger(this.jwtService.getNameId()).subscribe(data => {
      this.user = data;
      console.log(this.user);
    }, err => console.log(err));

    this.initiliazeCataloguePrices();

  }

  priceSelected : boolean = false;
  onSubmitEmail() {
    if (this.selectedPrice > 0) {
      
      this.priceSelected = true;
      console.log(this.data.CatalogueId);
      let sendData = {CataloguePriceId : this.data.CatalogueId,
                      Email : this.emailForm.get('emailAddress').value}
      
      this.ticketService.buyTicketUnregistred(sendData).subscribe(data => {
        alert(data);
        this.emailForm.reset();
      }, error => console.log(error));
      
      
    }
    else {
      this.priceSelected = false;
    }
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
      yearId: this.catalogues[i].CatalogueId + "|Year",
      catalogueVersion: this.catalogues[i].catalogueVersion,
      hourPriceVersion: this.catalogues[i].hourPriceVersion,
      dayPriceVersion: this.catalogues[i].dayPriceVersion,
      monthPriceVersion: this.catalogues[i].monthPriceVersion,
      yearPriceVersion: this.catalogues[i].yearPriceVersion,
    }

    console.log(sendData);
    this.cataloguePriceService.updateCataloguePrice(sendData).subscribe(data => {
      this.initiliazeCataloguePrices();
    }, err => console.log(err))
  }

  selectedPrice : number = 0;

  onPriceTableRowClick(type: string) {
    if (this.jwtService.geIsLoggedIn() == false) {
      this.selectedPrice = this.data.Hour * 1;
        this.selectedTicketType = "Hour";
        return;
    }
    let coeficient = 1;
    if (this.user.ProcessingPhase == 1) {
      if (this.user.Discount.DiscountTypeName == "Student" || this.user.Discount.DiscountTypeName == "Senior") {
        coeficient = this.user.Discount.DiscountCoeficient;
      }
    }

    
    switch(type) {
      case 'hour' :
        this.selectedPrice = this.data.Hour * coeficient;
        this.selectedTicketType = "Hour";
        break;
      case 'day' :
        this.selectedPrice = this.data.Day * coeficient;
        this.selectedTicketType = "Day";
        break;
      case 'month' :
        this.selectedPrice = this.data.Month * coeficient;
        this.selectedTicketType = "Month";
        break;
      case 'year' :
        this.selectedPrice = this.data.Year * coeficient;
        this.selectedTicketType = "Year";
        break;
    }
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
    let version = this.catalogues[index].Version; !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    this.cataloguePriceService.deleteCatalogue(id, version).subscribe(
      data => {
        console.log(data);
        this.initiliazeCataloguePrices();
      },
      err => {
        console.log(err);
      }
    )
  }

  checkUncheckTicket(index: number){
    console.log(this.user);
    this.ticketService.checkUncheckTicket(this.user.Tickets[index].TicketId).subscribe(
      data => {
        this.user.Tickets[index] = data;
      },
      error =>{
        console.log(error);
      }
    )
  }

  buyTicket() {
    let sendData = {
      PriceId : this.data.CatalogueId + "|" + this.selectedTicketType,
      PassengerType : this.user.Discount.DiscountTypeName
    }

    console.log(sendData);

    this.ticketService.buyTicket(sendData).subscribe(
      data =>{
        console.log(data);
        this.user.Tickets.push(data);
      },
      err => console.log(err)
    )
  }

}
