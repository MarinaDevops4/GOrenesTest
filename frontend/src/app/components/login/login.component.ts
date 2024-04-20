import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/Auth/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showErrorMessages = false;
  showSuccessMessage = false;
  formSubmittedSuccessfully = false;
  loading = false;
  error = '';
  success = ''
  currentUser: User | null | undefined;

  constructor(private formBuilder: FormBuilder, private authService:AuthenticationService) {
    this.loginForm = this.formBuilder.group({
      // name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      accepted: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() { 
    this.currentUser = this.authService.getCurrentUser();
    if(this.currentUser){
      this.formSubmittedSuccessfully = true;
      this.showSuccessMessage = true;
      this.success = 'Bienvenid@ ' + this.currentUser.name;
    }

    console.log(this.currentUser);
  }

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

  shouldShowError(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched || this.showErrorMessages);
  }
  
  getErrorMessage(controlName: string) {
    const control = this.loginForm.get(controlName);
  
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    } else if (control?.hasError('email')) {
      return 'El correo electrónico no es válido';
    } else if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    } else if (controlName === 'accepted' && control?.hasError('requiredTrue')) {
      return 'Debes aceptar los términos y condiciones';
    }

    if(this.showErrorMessages = true){

    }
  
    return 'Error desconocido';
  }

  getSuccessMessage(): string {
    return this.success;
  }
  
  
  markControlAsInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    if (control) {
      control.markAsTouched(); 
      control.markAsDirty(); 
    }
  }

  loggout(){
    this.authService.logout();
    this.formSubmittedSuccessfully = false;
  }
  
}
