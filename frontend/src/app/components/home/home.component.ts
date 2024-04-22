import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/Auth/authentication.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{ 
  userName:string = '';
  userToken:any;
  constructor(private authService: AuthenticationService){}

  ngOnInit(): void {
    console.log('home component');
    this.userToken = this.authService.getAccessToken(); 
    console.log(this.userToken);
    this.authService.getUserByToken(this.userToken).subscribe(
        (userData) => {
            this.userName = userData.username; 
            console.log(this.userName);
        },
        (error) => {
            console.error('Error al obtener los detalles del usuario:', error);
        }
    );
}



}
