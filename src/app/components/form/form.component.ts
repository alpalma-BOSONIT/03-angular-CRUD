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

  // userForm: FormGroup = new FormGroup({
  //   username: new FormControl(''),
  //   password: new FormControl(''),
  //   passwordConfirm: new FormControl(''),
  //   email: new FormControl(''),
  //   subscribe: new FormControl(false),
  //   country: new FormControl(''),
  //   city: new FormControl(''),
  // });

  userForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required]], // TODO: Custom validator check password
    email: ['', [Validators.required, Validators.email]], // TODO: custom validator check if bosonit
    subscribe: [false],
    country: ['', Validators.required],
    city: ['', Validators.minLength(3)],
  });

  constructor(private fb: FormBuilder, private us: UserService) {}

  ngOnInit(): void {
    this.us.users$.subscribe((users) => (this.users = users));
    this.us.operationType$.subscribe((type) => (this.operationType = type));
    this.us.userToUpdate$.subscribe((user) => (this.userToUpdate = user));
  }

  ngDoCheck(): void {
    // const user: User = { ...this.userToUpdate };
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

  resetForm(): void {
    this.userForm.setValue({
      username: '',
      password: '',
      passwordConfirm: '',
      email: '',
      subscribe: false,
      country: '',
      city: '',
    });
  }

  addUser(): void {
    this.us.addUser({ id: Date.now(), ...this.userForm.value });
    this.resetForm();
  }

  updateUser(): void {
    this.us.updateUser({
      id: this.userToUpdate.id,
      ...this.userForm.value,
    });
    this.resetForm();
  }

  onSubmit(): void {
    if (this.operationType === 'create') this.addUser();
    if (this.operationType === 'editing') this.updateUser();
  }
}
