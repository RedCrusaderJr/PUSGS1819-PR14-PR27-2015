import { Component, OnInit } from '@angular/core';
import { PassengerService } from '../services/http/passenger.service';
import { JwtService } from '../services/jwt.service';
import { Passenger } from '../Models/Passenger';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ConfirmPasswordValidator } from '../validators/confirm-password-validator';
import { AccountService } from '../services/http/account.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [PassengerService, JwtService, AccountService]
})
export class ProfileComponent implements OnInit {
  profile: Passenger = new Passenger();
  serverErrors: string[];
  // mySrc: SafeUrl;
  mySrc: String;
  noImg: String
  buttonSelection: number;

  selectedFile: File = null;
  profileForm: FormGroup;
  changePasswordForm = this.fb.group({
    oldPassword: ['',
      [Validators.required,
      Validators.minLength(6),
      Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])/)]],
    password: ['',
      [Validators.required,
      Validators.minLength(6),
      Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])/)]],
    confirmPassword: ['',
      Validators.required],

  }, { validators: ConfirmPasswordValidator });

  constructor(private sanitazer: DomSanitizer, private passengerService: PassengerService, private router: Router, private jwtService: JwtService, private fb: FormBuilder, private accountService: AccountService) {

  }

  ngOnInit() {
    this.buttonSelection = undefined;
    this.noImg = "assets/img/NoImageToPreview.png";
    if (this.jwtService.getRole() == "AppUser") {
      this.profileForm = this.fb.group({
        username: [this.profile.username,
        [Validators.required,
        Validators.minLength(6)]],

        email: [this.profile.email,
        [Validators.email]],
        name: [this.profile.name,
        Validators.required],
        surname: [this.profile.surname,
        Validators.required],
        dateOfBirth: [this.profile.dateOfBirth, Validators.required],
        type: [this.profile.type, Validators.required]
      });
    }
    else {
      this.profileForm = this.fb.group({
        username: [this.profile.username,
        [Validators.required,
        Validators.minLength(6)]],
        email: [this.profile.email,
        [Validators.email]]
      });
    }

    this.passengerService.getPassenger(this.jwtService.getNameId()).subscribe(
      data => {
        this.profile.username = data.UserName;
        this.profileForm.patchValue({ username: data.UserName });
        console.log(this.profileForm.get('username'));
        this.profile.email = data.Email;
        this.profileForm.patchValue({ email: data.Email });
        if (this.jwtService.getRole() == "AppUser") {


          this.profile.name = data.Name;
          this.profile.surname = data.Surname;
          this.profile.dateOfBirth = data.DateOfBirthString;
          this.profile.type = data.Type;
          this.profile.ProcessingPhase = data.ProcessingPhase;

          this.profileForm.patchValue({ name: data.Name });
          this.profileForm.patchValue({ surname: data.Surname });
          this.profileForm.patchValue({ dateOfBirth: data.DateOfBirthString });
          this.profileForm.patchValue({ type: data.Type });

          this.passengerService.downloadImage(this.jwtService.getNameId()).subscribe(
            data => {
              this.mySrc = 'data:image/jpeg;base64,' + data;
            },
            err => {
              console.log(err);
            }
          )
        }


      },
      error => {
        console.log(error);
      }
    );
  }

  get f() { return this.profileForm.controls; }
  get ch() { return this.changePasswordForm.controls; }
  optionsForm = this.fb.group({
    option: ['']
  });

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  change(selection: number) {
    this.serverErrors = [];
    if (this.buttonSelection != undefined && this.buttonSelection == selection) {
      this.buttonSelection = undefined;
    } else {
      this.buttonSelection = selection;
    }
  }

  //#region Submits
  onSubmit() {
    let passengerToUpdate: Passenger = new Passenger();

    passengerToUpdate.username = this.jwtService.getNameId();
    passengerToUpdate.email = this.profileForm.get('email').value;



    if (this.jwtService.getRole() == "AppUser") {
      passengerToUpdate.name = this.profileForm.get('name').value;
      passengerToUpdate.surname = this.profileForm.get('surname').value;
      passengerToUpdate.dateOfBirth = this.profileForm.get('dateOfBirth').value;
      passengerToUpdate.type = this.profileForm.get('type').value;

    }
    this.passengerService.update(passengerToUpdate, this.jwtService.getNameId()).subscribe(
      data => {
        this.passengerService.getPassenger(this.jwtService.getNameId()).subscribe(
          data => {
            this.serverErrors = [];
            this.profile.username = data.UserName;
            this.profileForm.patchValue({ username: data.UserName });
            console.log(this.profileForm.get('username'));
            this.profile.email = data.Email;
            this.profileForm.patchValue({ email: data.Email });
            if (this.jwtService.getRole() == "AppUser") {


              this.profile.name = data.Name;
              this.profile.surname = data.Surname;
              this.profile.dateOfBirth = data.DateOfBirthString;
              this.profile.type = data.Type;
              this.profile.ProcessingPhase = data.ProcessingPhase;

              this.profileForm.patchValue({ name: data.Name });
              this.profileForm.patchValue({ surname: data.Surname });
              this.profileForm.patchValue({ dateOfBirth: data.DateOfBirthString });
              this.profileForm.patchValue({ type: data.Type });
              this.router.navigate(['']);
            }

          },
          error => {
            this.serverErrors = [];
            console.log(error);
            console.log(error.error.ModelState);
            if (error.error.ModelState != "undefined") {

              console.log(error.error.ModelState[""]);
              this.serverErrors = error.error.ModelState[""];
            }
          }
        );
      },
      error => {
        this.serverErrors = [];
        console.log(error);
        console.log(error.error.ModelState);
        if (error.error.ModelState != "undefined") {

          console.log(error.error.ModelState[""]);
          this.serverErrors = error.error.ModelState[""];
        }
      }
    );
  }

  onSubmitChangePassword() {

    let dataForChangePassword = {
      OldPassword: this.changePasswordForm.get("oldPassword").value,
      NewPassword: this.changePasswordForm.get("password").value,
      ConfirmPassword: this.changePasswordForm.get("confirmPassword").value
    }

    this.accountService.changePassword(dataForChangePassword).subscribe(
      data => {
        this.serverErrors = [];
        localStorage.jwt = undefined;
        this.router.navigate(["login"]);
      },
      error => {
        console.log(error);
        this.serverErrors = [];

        if (error.error.ModelState != "undefined") {

          console.log(error.error.ModelState[""]);
          this.serverErrors = error.error.ModelState[""];
        }
        this.changePasswordForm.reset();
      }
    )
  }

  onClickProfile() {
    this.serverErrors = [];
  }

  onSubmitPicture() {
    let formData: FormData = new FormData();
    formData.append('picture', this.selectedFile, this.selectedFile.name);

    let options = {
      sheaders:
      {
        "Content-type": "application/json"
      }
    }
    this.accountService.uploadImage(formData, this.jwtService.getNameId(), options).subscribe(data => {
      this.passengerService.downloadImage(this.jwtService.getNameId()).subscribe(data => {
        this.mySrc = 'data:image/jpeg;base64,' + data;
      },
        error => console.log(error));
    },
      error => console.log(error));
  }
  //#endregion
}