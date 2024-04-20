import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      accepted: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulario validado');
      this.showSuccessMessage = true;
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
  
    return 'Error desconocido';
  }

  getSuccessMessage(): string {
    return "¡El formulario se envió con éxito!";
  }
  
  
  markControlAsInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    if (control) {
      control.markAsTouched(); 
      control.markAsDirty(); 
    }
  }
  
}
