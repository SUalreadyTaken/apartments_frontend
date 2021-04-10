import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const HOME_ROUTE: Routes = [
  { path: 'forgotPassword/:token', component: ForgotPasswordComponent },
  { path: '', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent },
];