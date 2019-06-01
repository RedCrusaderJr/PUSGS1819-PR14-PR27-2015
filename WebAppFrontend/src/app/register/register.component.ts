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
    username:['', 
      [Validators.required,
      Validators.minLength(6)]],
    password:['',
      [Validators.required,
      Validators.minLength(6),
      Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])/)]],
    confirmPassword:['',
      Validators.required],
    email:['',
      [Validators.email]],  
  }, {validators: ConfirmPasswordValidator});

  
  get f() { return this.registerForm.controls; }
  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) { }

  

  ngOnInit() {
  }

  onSubmit(){
    let regModel : RegistrationModel = this.registerForm.value;
    this.accountService.register(regModel).subscribe(
      ret => {
        this.serverErrors = [];
        alert("Succesfully registered!");
        this.router.navigate(["login"]);
      },
      err => {
        this.serverErrors = err.error.ModelState[""]
        console.log(err);

      }
    );
  }


}
