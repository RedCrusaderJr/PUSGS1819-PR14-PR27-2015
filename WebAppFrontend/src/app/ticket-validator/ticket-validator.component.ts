import { Component, OnInit } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { TicketService } from '../services/http/ticket.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ticket-validator',
  templateUrl: './ticket-validator.component.html',
  styleUrls: ['./ticket-validator.component.css'],
  providers: [JwtService, TicketService]
})
export class TicketValidatorComponent implements OnInit {

  constructor(private jwtService : JwtService, private ticketService : TicketService, private fb : FormBuilder) { }

  validateTicketsForm = this.fb.group({
    ticketId : ['', Validators.min(0)]
  })
  ngOnInit() {
  }

  selectedTicket = null;

  validateSubmit() {
    this.ticketService.checkTicket(this.validateTicketsForm.get('ticketId').value).subscribe(
      data => {
          this.validateTicketsForm.reset;
          this.selectedTicket = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  

  unvalidateTicket() {
    this.ticketService.unvalidateTicket(this.selectedTicket.TicketId).subscribe(
      data => {
        alert("Ticket is successfully unvalidated.");
        this.selectedTicket = null;
      }, 
      error => {
        console.log(error);
      }
    );
  }

}
