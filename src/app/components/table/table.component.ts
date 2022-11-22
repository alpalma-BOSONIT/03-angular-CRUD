import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  users: User[] = [];

  constructor(private us: UserService) {}

  ngOnInit(): void {
    this.us.users$.subscribe((users) => (this.users = users));
  }

  setUpdateUser(user: User): void {
    this.us.setUpdateUser(user);
  }
}
