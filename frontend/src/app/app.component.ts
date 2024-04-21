
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, LoginComponent, HttpClientModule, RegisterComponent, CommonModule]
})
export class AppComponent implements OnInit{
  title = 'frontend';

  isChangeForm: boolean = false;
  constructor(){

  }
  
  
  ngOnInit(): void {
    this.isChangeForm = false;
  }


  changeForm() {
    this.isChangeForm = !this.isChangeForm;
    console.log(this.isChangeForm);
  }

}
