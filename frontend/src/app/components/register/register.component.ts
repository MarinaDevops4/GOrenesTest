import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/Auth/authentication.service';
import { ShareComponentDataService } from '../../services/Data/share-component-data.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [AuthenticationService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
registerForm: FormGroup;
isloginUser:boolean = false;
hiddenRegisterForm:boolean = false;
inputTypePass: string = 'password';
inputTypeConfirm: string = 'password';


showErrorMessages:boolean = false;
showSuccessMessage:boolean = false;

success = '';
errorMessage: string = '';


  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder, private sharedService: ShareComponentDataService) {
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


  togglePasswordVisibility(controlName: string) {
    if (controlName === 'password') {
        this.inputTypePass = this.inputTypePass === 'password' ? 'text' : 'password';
    } else if (controlName === 'confirmPassword') {
        this.inputTypeConfirm = this.inputTypeConfirm === 'password' ? 'text' : 'password';
    }
}

  onSubmit() {
    if(this.registerForm.valid){
     
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
    
      this.registerForm.get('confirmPassword')?.setErrors({ 'passwordMismatch': true });
     
      this.showErrorMessages = true;
      return;
    }
      console.log('Form validated');

      const userData = {
        username: this.registerForm.value.name,
        email: this.registerForm.value.email.toLowerCase(),
        password: this.registerForm.value.password
      };

      if (userData) {
        this.authService.registerUser(userData)
          .subscribe(response => {
            console.log('User registered successfully:', response);
            // Verificar si el registro fue exitoso
            if (response && response.message === 'Usuario registrado exitosamente') {
              // Emite el evento para mostrar el formulario de inicio de sesión
              this.sharedService.setSharedVariable(true);
            } else {
              // El usuario ya existe en la base de datos, muestra un mensaje
              this.errorMessage = 'El usuario ya existe en la base de datos';
              console.error(this.errorMessage);
              // Puedes mostrar un mensaje al usuario aquí si lo deseas
            }
          }, error => {
            console.error('Error registering user:', error);
            this.errorMessage = 'El usuario ya existe en la base de datos';
            console.error(this.errorMessage);
          });
      }



    }else{
      this.showErrorMessages = true;
      console.log('Form not valid');
    }
  }

   // Determine if error should be shown for a control
   shouldShowError(controlName: string) {
    const control = this.registerForm.get(controlName);
    return (
      control?.invalid &&
      (control?.dirty || control?.touched || this.showErrorMessages)
    );
  }
  
  // Get error message for a control
  getErrorMessage(controlName: string) {
    const control = this.registerForm.get(controlName);
  
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    } else if (controlName === 'email' && control?.hasError('email')) {
      return 'El correo electrónico no es válido';
    } else if (controlName === 'password' && control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    } else if (controlName === 'confirmPassword' && control?.hasError('required')) {
      return 'Debes confirmar la contraseña';
    } else if (controlName === 'confirmPassword' && control?.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden';
    } else if (controlName === 'accepted' && control?.hasError('requiredTrue')) {
      return 'Debes aceptar los términos y condiciones';
    }
    return 'Error desconocido';
  }

  // Get success message
  getSuccessMessage(): string {
    return this.success;
  }


    // Ocultar mensajes de error
    hideErrorMessages() {
      this.showErrorMessages = false;
    }


    // Mark control as invalid
    markControlAsInvalid(controlName: string) {
      const control = this.registerForm.get(controlName);
      console.log(control);
      if (control) {
        control.markAsTouched(); 
        control.markAsDirty(); 
        control.setErrors({ 'invalid': true }); 
      }
  }
  
  arePasswordsEqual(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    // console.log(password, confirmPassword);
    return password === confirmPassword;
  }
  
}