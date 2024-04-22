
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ShareComponentDataService } from './services/Data/share-component-data.service';

import { HomeComponent } from './components/home/home.component';
import { AuthenticationService } from './services/Auth/authentication.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, LoginComponent, HttpClientModule, RegisterComponent, CommonModule, HomeComponent],
    providers: [
      AuthenticationService,
    ],
  })
  
  export class AppComponent implements OnInit {
    title = 'frontend';
    showRegisterForm: boolean = false;
    isChangeForm: boolean = false;
    isLoggedIn: boolean = false;
    loginHover: boolean = false;
    registerHover: boolean = false;
    logoutHover: boolean = false;

  
    constructor(
      private sharedService: ShareComponentDataService,
      private authService: AuthenticationService
    ) {}
  
    ngOnInit(): void {
      // Inicialización de variables
      this.isChangeForm = false;
  
      // Suscripción al cambio de formulario
      this.sharedService.showRegisterForm$.subscribe((value) => {
              // Solo actualiza isChangeForm si el formulario de registro está activo
        if (!value) {
          console.log(value);
          this.isChangeForm = false;
        }

        // Si el usuario ya ha iniciado sesión, mantiene isLoggedIn en true
        if (!this.isLoggedIn) {
          this.isChangeForm = value; 
        }

        // Actualiza isLoggedIn basado en el valor actual de value
         this.isLoggedIn = value;
      });
  
      // Suscripción al cambio de estado de autenticación
      this.authService.getAuthenticationChanged().subscribe((loggedIn) => {
        this.isLoggedIn = loggedIn;
      });
  
      // Verificación de estado de autenticación al iniciar la aplicación
      const userLoggedIn = this.authService.getAccessToken();
      if (userLoggedIn) {
        this.isLoggedIn = true;
        console.log('user is ', this.isLoggedIn)
      } else {
        this.isLoggedIn = false;
      }
    }
  
    // Cambia entre los formularios de inicio de sesión y registro
    changeForm() {
      this.isChangeForm = !this.isChangeForm;
    }
  
 
    logout() {
      this.authService.logout();
      this.isChangeForm = false;
    }
  }
