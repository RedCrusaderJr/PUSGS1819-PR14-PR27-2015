import { Component, OnInit } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { PassengerService } from '../services/http/passenger.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-validate-users',
  templateUrl: './validate-users.component.html',
  styleUrls: ['./validate-users.component.css'],
  providers: [JwtService, PassengerService]
})
export class ValidateUsersComponent implements OnInit {

  constructor(private jwtService: JwtService, private passengerService : PassengerService, private fb: FormBuilder) { }
  reasonForm = this.fb.group({
    reason: [""]
  });

  unvalidatedUsers = null;
  userToValidate = null;
  imageToValidate = null;
  reason = "";
  ngOnInit() {
    this.passengerService.getAllUnvalidatedUsers().subscribe(
      data => {
        this.unvalidatedUsers = data;
      },
      error =>{
        console.log(error);
      }
    )
  }

  onValidateClick(index: number){
    this.userToValidate = this.unvalidatedUsers[index];  
    this.passengerService.downloadImage(this.unvalidatedUsers[index].UserName).subscribe(
      data => {
        this.imageToValidate = 'data:image/jpeg;base64,' + data;
      }, error => {
        console.log(error);
        this.userToValidate = null;
        this.imageToValidate = null;
      }
    ) 

    
  }

  onValidateUser(option: number) {
    let sendData = {
      UserId : this.userToValidate.UserName,
      ProcessingPhase : option,
      Reason: this.reasonForm.get('reason').value
    }
    console.log(this.reasonForm.get('reason'));
    this.passengerService.validateUser(sendData).subscribe(
      data => {
        alert(`User: ${this.userToValidate.UserName} has been successfully validated.`)
        this.userToValidate = null;
        this.passengerService.getAllUnvalidatedUsers().subscribe(
          data => {
            this.unvalidatedUsers = data;
            this.reasonForm.reset();
          },
          error =>{
            console.log(error);
          }
        )
      },
      error => {
        console.log(error);
      }
    )
  }

}
