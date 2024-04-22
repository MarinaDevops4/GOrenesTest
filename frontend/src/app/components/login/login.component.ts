import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/Auth/authentication.service';
import { ShareComponentDataService } from '../../services/Data/share-component-data.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RegisterComponent,
    HttpClientModule,
  ],
  providers: [AuthenticationService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showErrorMessages: boolean = false;
  showSuccessMessage: boolean = false;
  formSubmittedSuccessfully: boolean = false;
  loading: boolean = false;
  error = '';
  success = '';
  isLoggedIn: boolean = false;
  
  constructor(
    private shareService: ShareComponentDataService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    // Suscribirse a cambios en la autenticación
    this.authService.getAuthenticationChanged().subscribe(authenticated => {
      this.showSuccessMessage = authenticated;
      if (authenticated) {
        this.success = 'Bienvenido!';
        this.formSubmittedSuccessfully = true;
      }
    });
  }

  // Manejar el envío del formulario
  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      console.log('Formulario validado');
      const { email, password } = this.loginForm.value;
   
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.loading = false;
          if (response && response.token) {
            // Iniciar sesión exitosa
            this.authService.setToken(response.token);
            this.success = 'Bienvenido ' + response.name; 
            this.isLoggedIn = true;
            this.shareService.setSharedVariable(this.isLoggedIn);
          } else {
            // Mostrar mensaje de error para credenciales inválidas
            this.error = 'Inicio de sesión fallido, por favor verifique sus credenciales.';
            this.showErrorMessages = true;
          }
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 400 && error.error.message === 'Contraseña incorrecta') {
            // Mostrar mensaje de error específico para contraseña incorrecta
            this.error = 'La contraseña ingresada no es correcta';
          } else {
            // Mostrar mensaje de error genérico
            this.error = (error.error.message || error.message);
          }
          this.showErrorMessages = true;
      },
      });
    } else {
      this.showErrorMessages = true;
    }
  }

  // Determinar si se debe mostrar un error para un control
  shouldShowError(controlName: string) {
    const control = this.loginForm.get(controlName);
    return (
      control?.invalid &&
      (control?.dirty || control?.touched || this.showErrorMessages)
    );
  }

  // Obtener mensaje de error para un control
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

  // Obtener mensaje de éxito
  getSuccessMessage(): string {
    return this.success;
  }

  // Ocultar mensajes de error
  hideErrorMessages() {
    this.showErrorMessages = false;
  }

  // Marcar control como inválido
  markControlAsInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    console.log(control);
    if (control) {
      control.markAsTouched();
      control.markAsDirty();
      control.setErrors({ invalid: true }); // Marcar el control como inválido
    }
  }


}