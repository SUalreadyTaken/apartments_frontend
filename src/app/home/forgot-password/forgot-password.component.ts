import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/auth/login/login.service';
import { FormValidatorsService } from 'src/app/shared/form-validators.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  readonly form: FormGroup;
  private password: FormControl;
  private passwordConfirm: FormControl;
  private token: string;
  passwordError = { disappear: true };
  passwordConfirmError = { disappear: true };
  errorsDelay = 500;
  
  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    formValidator: FormValidatorsService
  ) {
    this.form = new FormGroup({});
    this.password = new FormControl('', {
      validators: Validators.required,
      asyncValidators: [
        formValidator.changeMatchPassword(
          'passwordConfirm',
          this.passwordConfirmError,
          500
        ),
        formValidator.validatorMinMax('password', this.form, this.passwordError, 500),
      ],
    });
    this.passwordConfirm = new FormControl('', {
      validators: Validators.required,
      asyncValidators: formValidator.matchPassword('password', this.passwordConfirmError, 500),
    });
    this.form.addControl('password', this.password);
    this.form.addControl('passwordConfirm', this.passwordConfirm);
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.params.token;
    // console.log(`mofo >> ${this.route.snapshot.params.token}`);
  }

  logForm() {
    console.log(this.form);
    console.log(
      `token > ${this.token}\npassword > ${this.form.get('password').value}\npasswordConfirm > ${
        this.form.get('passwordConfirm').value
      }`
    );
  }

  onSubmit() {
    this.loginService.resetPassword(
      this.token,
      this.form.get('password').value,
      this.form.get('passwordConfirm').value
    );
  }
}
