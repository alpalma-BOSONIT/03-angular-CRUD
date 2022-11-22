import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Operation } from '../types/operation';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  private _userToUpdate: BehaviorSubject<User> = new BehaviorSubject<User>({
    id: 0,
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    subscribe: false,
    country: '',
    city: '',
  });
  private _operationType: BehaviorSubject<Operation> =
    new BehaviorSubject<Operation>('create');

  public users$ = this._users.asObservable();
  public userToUpdate$ = this._userToUpdate.asObservable();
  public operationType$ = this._operationType.asObservable();

  constructor() {}
  setOperationType(type: Operation): void {
    this._operationType.next(type);
  }

  addUser(user: User): void {
    this._users.next([...this._users.value, user]);
  }

  updateUser(user: User): void {
    const users = [...this._users.value];
    const usersUpdated = users.map((u) => {
      if (u.id === user.id) {
        return user;
      } else {
        return u;
      }
    });
    this._users.next(usersUpdated);
    this._operationType.next('create');
  }

  setUpdateUser(user: User): void {
    this._operationType.next('update');
    this._userToUpdate.next(user);
  }
}
