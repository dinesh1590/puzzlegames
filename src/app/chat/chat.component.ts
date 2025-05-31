import { Component } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  editName = false;
  chatMessages: string[] = [];
  newMessage = '';
  playerName = 'Player-' + Math.floor(Math.random() * 1000);

  constructor(private wsService: WebsocketService) {}

  ngOnInit(): void {
    this.wsService.connect('ws://localhost:8080/ws');

    this.wsService.onMessage((msg) => {
      if (msg.type === 'chat') {
        this.chatMessages.push(`${msg.from}: ${msg.content}`);
      }
    });
  }

  sendMessage(): void {
    const chatMsg = {
      type: 'chat',
      from: this.playerName,
      content: this.newMessage,
    };
    this.wsService.send(chatMsg);
    this.newMessage = '';
  }
}
