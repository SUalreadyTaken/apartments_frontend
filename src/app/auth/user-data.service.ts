import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoginService } from './login/login.service';
import { UserC } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserDataService implements OnDestroy {
  private getUserSubject = new BehaviorSubject<any>('');
  getUser$ = this.getUserSubject.asObservable();
  userSubscription: Subscription;

  // TODO give it a better name.. not to confuse with actual views
  private getViewSubject = new BehaviorSubject<any>('');
  getView$ = this.getViewSubject.asObservable();
  viewSubscription: Subscription;

  constructor(private loginService: LoginService) {
    this.init();
  }

  init() {
    if (localStorage.getItem('jwt')) {
      this.loginService
        .getUser()
        .then((res) => this.setUser(res))
        .catch((err) => {});
    } else {
      console.log(`UserDataService init no jwt`);
    }
  }

  setView(view: string) {
    this.getViewSubject.next(view);
  }

  getView(): Observable<any> {
    return this.getView$;

    // typeof user === 'boolean' ? false : this.setUser(user);
    // return this.getUser$;
  }

  setUser(user: UserC) {
    this.getUserSubject.next(user);
  }

  getUser(): Observable<any> {
    return this.getUser$;

    // typeof user === 'boolean' ? false : this.setUser(user);
    // return this.getUser$;
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
