import { Component, DoCheck, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/interfaces/user.interface';
import { Operation } from 'src/app/types/operation';
import { UserService } from '../../services/user.service';
import { PasswordMatch } from '../../validators/password.validator';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, DoCheck {
  countryOptions: string[] = ['Ireland', 'Australia', 'Spain', 'Guatemala'];
  users: User[] = [];
  userToUpdate: User = {
    id: 0,
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    subscribe: false,
    country: '',
    city: '',
  };
  operationType: Operation = 'create';
  btnText: string = this.operationType === 'create' ? 'Create' : 'Update';

  userForm: FormGroup = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required]], // TODO: Custom validator check password
      email: ['', [Validators.required, Validators.email]], // TODO: custom validator check if bosonit
      subscribe: [false],
      country: ['', Validators.required],
      city: ['', Validators.minLength(3)],
    },
    {
      validator: PasswordMatch('password', 'passwordConfirm'),
    }
  );

  constructor(private fb: FormBuilder, private us: UserService) {}

  ngOnInit(): void {
    this.us.users$.subscribe((users) => (this.users = users));
    this.us.operationType$.subscribe((type) => (this.operationType = type));
    this.us.userToUpdate$.subscribe((user) => (this.userToUpdate = user));
  }

  ngDoCheck(): void {
    if (this.operationType === 'update') {
      this.userForm.setValue({
        username: this.userToUpdate.username,
        password: this.userToUpdate.password,
        passwordConfirm: this.userToUpdate.passwordConfirm,
        email: this.userToUpdate.email,
        subscribe: this.userToUpdate.subscribe,
        country: this.userToUpdate.country,
        city: this.userToUpdate.city,
      });
      this.us.setOperationType('editing');
    }
  }

  inputIsValid(field: string): any {
    return (
      this.userForm.controls[field].errors &&
      this.userForm.controls[field].touched
    );
  }

  renderError(field: string): string {
    const errors = this.userForm.controls[field].errors;

    if (errors?.hasOwnProperty('required')) return 'is required!';
    if (errors?.hasOwnProperty('minlength'))
      return `must be at least ${errors['minlength'].requiredLength} characters long!`;
    if (errors?.hasOwnProperty('email')) return 'is not a valid format!';
    if (errors?.hasOwnProperty('passwordMatch'))
      return 'and password must match!';

    return '';
  }

  addUser(): void {
    this.us.addUser({ id: Date.now(), ...this.userForm.value });

    this.userForm.reset();
  }

  updateUser(): void {
    this.us.updateUser({
      id: this.userToUpdate.id,
      ...this.userForm.value,
    });
    this.userForm.reset();
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.operationType === 'create') this.addUser();
    if (this.operationType === 'editing') this.updateUser();
  }
}
