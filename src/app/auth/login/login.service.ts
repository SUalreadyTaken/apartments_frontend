import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TestTest } from './login.model';
import { RealLogin } from './real-login.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { UserC } from '../user.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // TODO change service name to UserService
  SERVER_URL: string = environment.server_url;

  constructor(private http: HttpClient) {}

  async signUp(creds: RealLogin) {
    const res: any = await this.http
      .post(this.SERVER_URL + 'user/signup', creds, { observe: 'body' })
      .toPromise();
    this.setSession(res.token);
    return res.data.user;
  }

  async login(email: string, password: string) {
    const res: any = await this.http
      .post(this.SERVER_URL + 'user/login', { email, password })
      .toPromise();
    this.setSession(res.token);
    return res.data.user;
  }
  
  logout() {
    localStorage.removeItem('jwt');
  }
  
  async forgotPassword (email: string): Promise<number> {
    const res: any = await this.http
    .post(this.SERVER_URL + 'user/forgotPassword', { email }, { observe: 'body' })
    .toPromise();
    return res.status;
  }
  
  async resetPassword (token: string, password: string, passwordConfirm: string): Promise<number> {
    const res: any = await this.http
    .post(this.SERVER_URL + 'user/resetPassword', { token, password, passwordConfirm  }, { observe: 'body' })
    .toPromise();
    this.setSession(res.token);
    return res.data.user;
  }

  async getUser(): Promise<UserC> {
    const res: any = await this.http
      .get(this.SERVER_URL + 'user/', { observe: 'body' })
      .toPromise();
    return new UserC(res.data.role, res.data._id, res.data.email);
  }

  private setSession(token: string) {
    console.log('setSession got hit');
    localStorage.setItem('jwt', token);
  }

  // TODO expires do i need it
  // private tokenExpired(token: string) {
  //   const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
  //   return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  // }

  // isLoggedOut() {
  //   return !this.isLoggedIn();
  // }

  // public isLoggedIn() {
  //   return moment().isBefore(this.getExpiration());
  // }

  // private getExpiration() {
  //   const expiration = localStorage.getItem('expires_at');
  //   const expiresAt = JSON.parse(expiration);
  //   return moment(expiresAt);
  // }
}
