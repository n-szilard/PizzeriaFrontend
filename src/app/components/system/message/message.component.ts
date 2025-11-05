import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../../interfaces/message';
import { MessageService } from '../../../services/message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit{
  message: Message | null = null;

  constructor(private messageService: MessageService){}

  icon: string = '';

  ngOnInit(): void {
    this.messageService.message$.subscribe(msg => {
      this.message = msg;
      switch (this.message?.severity) {
        case 'info': {
          this.icon = 'bi-info-circle-fill';
          break;
        } case 'warning': {
          this.icon = 'bi-exclamation-triangle-fill';
          break;
        } case 'success': {
          this.icon = 'bi-check';
          break;
        } case 'danger': {
          this.icon = 'bi-x-circle-fill';
          break;
        } default: {
          this.icon = 'bi-question'
          break;
        }
      }

    });

  }
}
