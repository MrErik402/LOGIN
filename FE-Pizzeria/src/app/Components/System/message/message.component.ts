import { Component, Input, OnInit } from '@angular/core';

import { CommonModule, NgIf } from '@angular/common';
import { Message } from '../../../Interfaces/Message';
import { MessageService } from '../../../Services/message.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit{
  messageMain:Message | null = null;

  constructor(private messageService: MessageService){}
  ngOnInit(): void {

    this.messageService.message$.subscribe(msg => {
      this.messageMain = msg

      switch(this.messageMain?.severity){
        case 'info':{
          this.messageMain.icon = "bi-info-circle-fill";
          break;
        }
        case 'warning':{
          this.messageMain.icon = "bi-exclamation-triangle-fill";
          break;
        }
        case 'success':{
          this.messageMain.icon = "bi-check-circle-fill";
          break;
        }
        case 'danger':{
          this.messageMain.icon = "bi-x-circle-fill";
          break;
        }
      }
    })
    
  }


}
