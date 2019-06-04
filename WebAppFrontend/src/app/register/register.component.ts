import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '../validators/confirm-password-validator';
import { RegistrationModel } from '../Models/RegistrationModel';
import { AccountService } from '../services/http/account.service';
import { Server } from 'selenium-webdriver/safari';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AccountService]
})
export class RegisterComponent implements OnInit {

  serverErrors: string[];
  registerForm = this.fb.group({
    username: ['',
      [Validators.required,
      Validators.minLength(6)]],
    password: ['',
      [Validators.required,
      Validators.minLength(6),
      Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])/)]],
    confirmPassword: ['',
      Validators.required],
    email: ['',
      [Validators.email]],
    picture: [''],
    name: ['',
      Validators.required],
    surname: ['',
      Validators.required],
    dateOfBirth: ['', Validators.required],
    type: ['Regular', Validators.required]
  }, { validators: ConfirmPasswordValidator });
  selectedFile: File = null;
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }
  get f() { return this.registerForm.controls; }
  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) { }



  ngOnInit() {
  }

  onSubmit() {
    let regModel: RegistrationModel = this.registerForm.value;
    let formData: FormData = new FormData();

    if (this.selectedFile != null) {


      formData.append('picture', this.selectedFile, this.selectedFile.name);
    }

    let options = {
      sheaders:
      {
        "Content-type": "application/json"
      }
    }
    this.accountService.register(regModel).subscribe(
      ret => {
        this.serverErrors = [];
        if (this.selectedFile != null) {
          this.accountService.uploadImage(formData, regModel.username, options).subscribe(ret => {
            alert("Succesfully registered!");
            this.router.navigate(["login"]);
          },
            err => console.log(err));
        }
        else {
          alert("Succesfully registered!");
          this.router.navigate(["login"]);
        }

      },
      err => {
        console.log(err);
        this.serverErrors = err.error.ModelState[""]


      }
    );
  }


}
