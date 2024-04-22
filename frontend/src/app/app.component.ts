
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
  
export class AppComponent implements OnInit{
  title = 'frontend';
  showRegisterForm: boolean = false;
  isChangeForm: boolean = false;
  isLoggedIn: boolean = false;
  loginHover: boolean = false;
  registerHover: boolean = false;
  logoutHover: boolean = false;


  constructor(private sharedService: ShareComponentDataService, private authService: AuthenticationService){

  }
  
  
  ngOnInit(): void {
    this.isChangeForm = false;
    this.sharedService.showRegisterForm$.subscribe(value => {
      this.isChangeForm = value;
      console.log(this.isChangeForm);
      this.isLoggedIn = value;

});
    
this.authService.getAuthenticationChanged().subscribe((loggedIn) => {
  this.isLoggedIn = loggedIn;
});
   const userLoggedIn = this.authService.getAccessToken();
   if(userLoggedIn){
    this.isLoggedIn = true;
    console.log('Is User Logged in: ', this.isLoggedIn);
   }else{
    this.isLoggedIn = false;
   }
   
    
  }

  changeForm() {
    this.isChangeForm = !this.isChangeForm;
  }

  logout() {
    this.authService.logout();
  }

}
