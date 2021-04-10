import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDataService } from 'src/app/auth/user-data.service';
import { UserC } from 'src/app/auth/user.model';
import { FormValidatorsService } from 'src/app/shared/form-validators.service';
import { LoginService } from '../../../auth/login/login.service';
import { popupPages } from './popup-pages';

export type loginAction = 'register' | 'signIn' | 'signOut' | 'forgotPassword';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent implements OnInit {
  private popupPages = popupPages;
  page: loginAction;
  readonly form: FormGroup;
  private email: FormControl;
  private password: FormControl;
  private passwordConfirm: FormControl;
  errorMessage = null;
  hidePassword = true;
  recoverMessage: string = '';
  passwordError = { disappear: true };
  passwordConfirmError = { disappear: true };
  emailError = { disappear: true };
  errorsDelay = 500;

  constructor(
    @Inject(MAT_DIALOG_DATA) action: loginAction,
    private loginService: LoginService,
    private userDataService: UserDataService,
    formValidator: FormValidatorsService,
    private ref: MatDialogRef<PopupComponent>
  ) {
    this.email = new FormControl('', {
      validators: Validators.required,
      asyncValidators: formValidator.email(this.emailError, 500)
    });
    this.form = new FormGroup({});
    this.password = new FormControl('', {
      validators: Validators.required,
      asyncValidators: [
        formValidator.changeMatchPassword('passwordConfirm', this.passwordConfirmError, 500),
        formValidator.validatorMinMax('password', this.form, this.passwordError, 500),
      ],
    });
    this.passwordConfirm = new FormControl('', {
      validators: Validators.required,
      asyncValidators: formValidator.matchPassword('password', this.passwordConfirmError, 500),
    });
    this.switchPage((this.page = action));
  }

  ngOnInit(): void {}

  logForm() {
    console.log(this.form);
  }

  get currentPage() {
    return this.popupPages[this.page || 'signIn'];
  }

  private switchPage(page: loginAction) {
    // Removes all the controls from the form group
    if (this.errorMessage !== null) this.errorMessage = null;
    this.form.reset();
    Object.keys(this.form.controls).forEach((control) => {
      this.form.removeControl(control);
    });

    // Add the relevant controls to the form according to selected page
    switch ((this.page = page)) {
      case 'register':
        this.form.addControl('email', this.email);
        this.form.addControl('password', this.password);
        this.form.addControl('passwordConfirm', this.passwordConfirm);
        break;
      case 'signIn':
        this.form.addControl('email', this.email);
        this.form.addControl(
          'password',
          new FormControl(null, {
            validators: Validators.required,
            updateOn: 'change',
          })
        );
        break;
      case 'forgotPassword':
        this.form.addControl('email', this.email)
        break;
      default:
        console.log('DELETE this, switchPage() hit default, should not happen');
    }
  }

  public activate(action: loginAction) {
    switch (action) {
      case 'signIn':
        this.signIn(this.email.value, this.form.get('password').value);
        break;
      case 'register':
        this.registerNew(this.email.value, this.password.value, this.passwordConfirm.value);
        break;
      case 'forgotPassword':
        this.forgotPassword(this.form.get('email').value);
        break;
      default:
        console.log('DELETE this, activate() hit default, should not happen');
        break;
    }
  }

  private forgotPassword(email: string) {
    this.loginService
      .forgotPassword(email)
      .then((res: number) => {
        console.log(`res number > ${JSON.stringify(res)}`);
        //should only get 200
        if (res === 200) {
          console.log('forgotPassword res === 200... can move inside if');
        }
        this.recoverMessage = 'Password reset link has been sent to the email!';
        if (this.errorMessage !== null) this.errorMessage = null;
        // this.ref.close();
      })
      .catch((err) => {
        console.log(`error popupComponent.recover() '${err.error.message}'`);
        if (err.error.message.includes('no user')) {
          // return message === There is no user with email address.
          this.errorMessage = 'There is no user with email address.';
        } else {
          this.errorMessage = 'Something went wrong!';
        }
      });
  }

  private registerNew(email: string, password: string, passwordConfirm: string) {
    this.loginService
      .signUp({ email, password, passwordConfirm })
      .then((res) => {
        console.log(`register res > '${JSON.stringify(res)}'`);
        //'{"role":"user","active":true,"_id":"5fb289ed9834cf7cfb7f05a5","email":"asd33@asd.asd","__v":0}'
        this.userDataService.setUser(new UserC(res.role, res._id, res.email));
        if (this.errorMessage !== null) this.errorMessage = null;
        this.ref.close();
      })
      .catch((err) => {
        console.log(`error popupComponent.registerNew() '${err.error.message}'`);
        const tmp: string = err.error.message;
        if (err.error.message.includes('already in use')) {
          // backend env = production 'already in use will' will be sent
          const index = tmp.indexOf('use.');
          if (index > -1) {
            const withNewLine = tmp.slice(index + 4);
            this.errorMessage = tmp.slice(0, index + 4) + '\n' + withNewLine;
          }
        } else if (err.error.message.includes('duplicate key')) {
          // backend env = development 'duplicate key' will be sent
          const index = tmp.indexOf('email: '); //7
          if (index > -1) {
            const endIndex = tmp.indexOf(' }', index + 7);
            const duplicateEmail = tmp.slice(index + 7, endIndex);
            this.errorMessage = `${duplicateEmail} already in use.\nPlease use another`;
          }
        } else {
          this.errorMessage = 'Something went wrong!';
        }
      });
  }

  private signIn(email: string, password: string) {
    this.loginService
      .login(email, password)
      .then((res) => {
        this.userDataService.setUser(new UserC(res.role, res._id, res.email));
        if (this.errorMessage !== null) this.errorMessage = null;
        this.ref.close();
      })
      .catch((err) => {
        console.log(`error popupComponent.signIn() '${err.error.message}'`);
        const tmpError = err.error.message.toLowerCase();
        if (tmpError.includes('incorrect')) {
          this.errorMessage = 'Incorrect email or password!';
        } else {
          this.errorMessage = 'Something went wrong!';
        }
      });
  }
}
