import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/Auth/authentication.service';
import { ShareComponentDataService } from '../../services/Data/share-component-data.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RegisterComponent, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showErrorMessages:boolean = false;
  showSuccessMessage:boolean = false;
  formSubmittedSuccessfully:boolean = false;
  loading:boolean = false;
  error = '';
  success = '';
  currentUser: User | null | undefined;
  isNewUser:boolean = false;
  showRegisterForm: boolean = false;


  constructor(private shareService:ShareComponentDataService, private formBuilder: FormBuilder, private authService:AuthenticationService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
      
    });
  }

  ngOnInit() { 
    // Get current user
    this.currentUser = this.authService.getCurrentUser();
    if(this.currentUser){
      this.formSubmittedSuccessfully = true;
      this.showSuccessMessage = true;
      this.success = 'Bienvenid@ ' + this.currentUser.name;
    }

    // Subscribe to showRegisterForm changes
    this.shareService.showRegisterForm$.subscribe(value => {
      this.showRegisterForm = value;
    });
  }

  // Show register form
  showRegister(): void {
    this.shareService.setSharedVariable(true);
  }

  // Handle form submission
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulario validado');
      const email = this.loginForm.controls['email'].value;
      const password = this.loginForm.controls['password'].value;

      this.authService.login(email, password).subscribe(
        user => {
          if (user === null) {
            this.error = 'Error al iniciar sesión'; 
            this.showErrorMessages = true;
            this.formSubmittedSuccessfully = false; 
          } else {
            console.log(user);
            this.success = 'Bienvenid@ ' + user.name;
            this.showSuccessMessage = true;
            this.formSubmittedSuccessfully = true;
          }
        },
        error => {
          this.showErrorMessages = true;
          this.error = 'Error al iniciar sesión'; 
          console.error(this.error);
          this.formSubmittedSuccessfully = false; 
        }
      );
    } else {
      this.showErrorMessages = true;
      console.log('Error en el formulario');
    } 
  }

  // Determine if error should be shown for a control
  shouldShowError(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched || this.showErrorMessages);
  }
  
  // Get error message for a control
  getErrorMessage(controlName: string) {
    const control = this.loginForm.get(controlName);
  
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    } else if (control?.hasError('email')) {
      return 'El correo electrónico no es válido';
    } else if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    } 
  
    return 'Error desconocido';
  }

  // Get success message
  getSuccessMessage(): string {
    return this.success;
  }

  hideErrorMessages() {
    this.showErrorMessages = false;
}
  
  // Mark control as invalid
  markControlAsInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    console.log(control);
    if (control) {
      control.markAsTouched(); 
      control.markAsDirty(); 
      control.setErrors({ 'invalid': true }); // Marcar el control como inválido
    }
}

  // Logout user
  loggout(){
    this.authService.logout();
    this.formSubmittedSuccessfully = false;
  }

  // Show new user registration form
  newUser(){
    console.log('newUser');
    this.isNewUser = true;
    this.showRegisterForm = true;
    if(this.isNewUser){
      this.showRegisterForm = true;
    }
  }
}
