import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UserDataService } from 'src/app/auth/user-data.service';
import { UserC } from 'src/app/auth/user.model';
import { loginAction, PopupComponent } from './popup/popup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userSubscription: Subscription;
  user: UserC;
  randomList = [1,2,3];

  constructor(private dialog: MatDialog, private userDataService: UserDataService) {}

  ngOnInit(): void {
    this.userSubscription = this.userDataService.getUser().subscribe((res) => {
      if (typeof res !== 'boolean' && res !== '') {
        this.user = res;
        this.isLoggedIn = true;
      }
    });
  }

  onLogin(action: loginAction = 'signIn') {
    this.dialog.open(PopupComponent, { data: action });
  }
  
  onRegister(action: loginAction = 'register') {
    this.dialog.open(PopupComponent, { data: action });
  }
  onLogout() {
    localStorage.removeItem('jwt');
    this.isLoggedIn = false;
  }

  onChangeView(view: string) {
    this.userDataService.setView(view);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
