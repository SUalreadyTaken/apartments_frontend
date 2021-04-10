import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserDataService } from '../auth/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  page = 'apartments';
  viewSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userDataService: UserDataService
  ) {}

  ngOnInit(): void {
    console.log(`toString >> ${this.route.snapshot}`);
    console.log(`mofo >> ${this.route.snapshot.data.path}`);
    const dataPath = this.route.snapshot.data.path;
    console.log(`if not given >> ${this.route.snapshot.data.xxx}`);
    if (dataPath === 'recover') {
      console.log('redirect to recover component');
      this.page = 'recover';
    } else {
      console.log(
        `undefined ? ${this.route.snapshot.data.path === undefined} ? so apartments component`
      );
      this.page = 'apartments';
    }
    // ---------------
    this.viewSubscription = this.userDataService.getView().subscribe((res) => {
      console.log(`viewSubscription res >> '${res}'`);
      switch (res) {
        case 'apartments':
          this.page = 'apartments';
          break;
        case 'recover':
          this.page = 'recover';
          break;
        default:
          break;
      }
    });
  }
  ngOnDestroy(): void {
    this.viewSubscription.unsubscribe();
  }
}
