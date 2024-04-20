import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShareComponentDataService } from '../../services/Data/share-component-data.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
registerForm: FormGroup;
isloginUser:boolean = false;
hiddenRegisterForm:boolean = false;
inputType: string = 'password';




  constructor( private formBuilder: FormBuilder, private sharedService: ShareComponentDataService) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      accepted: [false, Validators.requiredTrue]
    });
   }
  ngOnInit(): void {
 
  }

 

  showLoginForm(): void {
    this.sharedService.setSharedVariable(false);
  }

  togglePasswordVisibility() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  // registerUser(userData: any): void {
  //   this.userService.registerUser(userData)
  //     .subscribe(
  //       response => {
  //         console.log('Usuario registrado exitosamente:', response);
          
  //       },
  //       error => {
  //         console.error('Error al registrar usuario:', error);
          
  //       }
  //     );
  // }

  onSubmit() {
    if(this.registerForm.valid){

    }else{
      console.log('Form not valid');
    }
  }

}