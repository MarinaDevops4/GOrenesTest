import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareComponentDataService {


  private showRegisterFormSource = new Subject<boolean>();
  showRegisterForm$ = this.showRegisterFormSource.asObservable();
  constructor() { }
  setSharedVariable(value: boolean) {
    console.log('setSharedVariable', value);
    this.showRegisterFormSource.next(value);
  }
}
