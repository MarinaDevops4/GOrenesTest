import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShareComponentDataService } from '../../services/Data/share-component-data.service';
import { UserService } from './../../services/User/user.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [UserService],
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



  constructor(private userService:UserService, private formBuilder: FormBuilder, private sharedService: ShareComponentDataService) {
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

  togglePasswordVisibility(controlName: string) {
    if (controlName === 'password') {
        this.inputTypePass = this.inputTypePass === 'password' ? 'text' : 'password';
    } else if (controlName === 'confirmPassword') {
        this.inputTypeConfirm = this.inputTypeConfirm === 'password' ? 'text' : 'password';
    }
}



  onSubmit() {
    if(this.registerForm.valid){
       // Verificar si las contraseñas coinciden
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      // Establecer el error de contraseña que no coincide en el formulario
      this.registerForm.get('confirmPassword')?.setErrors({ 'passwordMismatch': true });
      // Mostrar el mensaje de error
      this.showErrorMessages = true;
      return;
    }
      console.log('Form validated');

    const userData = {
       name: this.registerForm.get('name')?.value,
       email: this.registerForm.get('email')?.value,
       password: this.registerForm.get('password')?.value,
    }

    if(userData){
      this.userService.registerUser(userData)
      .subscribe(
        response => {
          console.log('Usuario registrado exitosamente:', response);
          
        },
        error => {
          console.error('Error al registrar usuario:', error);
          
        }
      );
    }



    }else{
      this.showErrorMessages = true;
      console.log('Form not valid');
    }
  }

  // registerUser(userData:object){
  //   console.log(userData);
  //   this.userService.registerUser(userData)
  //   .subscribe(
  //     response => {
  //       console.log('Usuario registrado exitosamente:', response);
        
  //     },
  //     error => {
  //       console.error('Error al registrar usuario:', error);
        
  //     }
  //   );

  // }

   // Determine if error should be shown for a control
   shouldShowError(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched || this.showErrorMessages);
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

    // Mark control as invalid
    markControlAsInvalid(controlName: string) {
      const control = this.registerForm.get(controlName);
      console.log(control);
      if (control) {
        control.markAsTouched(); 
        control.markAsDirty(); 
        control.setErrors({ 'invalid': true }); // Marcar el control como inválido
      }
  }

}