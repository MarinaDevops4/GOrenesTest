
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ShareComponentDataService } from './services/Data/share-component-data.service';
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, LoginComponent, HttpClientModule, RegisterComponent, CommonModule]
})
export class AppComponent implements OnInit{
  title = 'frontend';
  showRegisterForm: boolean = false;
  isChangeForm: boolean = false;

  constructor(private sharedService: ShareComponentDataService){

  }
  
  
  ngOnInit(): void {
    this.isChangeForm = false;
    this.sharedService.showRegisterForm$.subscribe(value => {
      this.isChangeForm = value;
      console.log(this.isChangeForm)
    });
  }


  changeForm() {
    this.isChangeForm = !this.isChangeForm;
  }

}
