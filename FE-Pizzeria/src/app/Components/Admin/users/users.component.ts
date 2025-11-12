import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements  OnInit {
  ngOnInit(): void {
    this.getUsers();
  }
  constructor(
    private api: ApiService,
    private message: MessageService,
  ) {}
  userList:User[]=[]

  startIndex: number = 1;
  endIndex: number = 1;


  /*Pagizáció*/
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  pagedUsers: User[] = [];

  setPage(page: number) {
    this.currentPage = page;
    this.startIndex = (page - 1) * this.pageSize;
    this.endIndex = this.startIndex + this.pageSize;
    this.pagedUsers = this.userList.slice(this.startIndex, this.endIndex);
  }
  getUsers() {
    this.api.selectAll('users').then(res => {
      this.userList = res.data;
      this.totalPages = Math.ceil(this.userList.length / this.pageSize);
      this.setPage(1);
    })
  }
}
