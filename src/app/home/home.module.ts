import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// need to move it to app.model..
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { HOME_ROUTE, HomeComponent } from './';

import { ApartmentService } from '../core/apartment/apartment.service';
import { LoginService } from '../auth/login/login.service';
import { ApartmentsComponent } from './body/apartments/apartments.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HeaderComponent } from './header/header.component';
import { PopupComponent } from './header/popup/popup.component';
import { RecoverComponent } from './body/recover/recover.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BodyComponent } from './body/body.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forChild(HOME_ROUTE),
    BsDropdownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  declarations: [HomeComponent, ApartmentsComponent, HeaderComponent, PopupComponent, RecoverComponent, PageNotFoundComponent, BodyComponent, ForgotPasswordComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [],
  // entryComponents: [ApartmentsComponent, RecoverComponent],
  providers: [ApartmentService, LoginService],
})
export class HomeModule {}
