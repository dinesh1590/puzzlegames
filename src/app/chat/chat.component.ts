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
    playerName = '';
  playerAge: number | null = null;
  playerGender = '';
  joined = false;

  onlineUsers: any[] = [];
  openChats: { [userId: string]: { user: any, messages: string[], newMessage: string } } = {};

  constructor(private wsService: WebsocketService) {}

  joinChat(): void {
    this.wsService.connect('ws://localhost:8080/ws');

    this.wsService.autoJoin({
      name: this.playerName,
      age: this.playerAge,
      gender: this.playerGender
    });

    this.wsService.onMessage((msg) => {
      if (msg.type === 'chat') {
        const fromId = msg.fromId;
        if (!this.openChats[fromId]) {
          const sender = this.onlineUsers.find(u => u.id === fromId);
          this.openChats[fromId] = {
            user: sender || { name: msg.fromName, id: fromId },
            messages: [],
            newMessage: ''
          };
        }
        this.openChats[fromId].messages.push(`${msg.fromName}: ${msg.content}`);
      } else if (msg.type === 'user_list') {
        const seen = new Set();
        this.onlineUsers = msg.users
          .filter((u: { id: string }) => u.id !== this.wsService.userId)
          .filter((u: { id: string }) => {
            if (seen.has(u.id)) return false;
            seen.add(u.id);
            return true;
          });
      } else if (msg.type === 'user_online') {
        const alreadyExists = this.onlineUsers.some(u => u.id === msg.user.id);
        if (!alreadyExists && msg.user.id !== this.wsService.userId) {
          this.onlineUsers.push(msg.user);
        }
      } else if (msg.type === 'user_offline') {
        this.onlineUsers = this.onlineUsers.filter(u => u.id !== msg.userId);
      }
    });

    this.joined = true;
  }

  openChat(user: any): void {
    if (!this.openChats[user.id]) {
      this.openChats[user.id] = {
        user,
        messages: [],
        newMessage: ''
      };
    }
  }

  sendMessage(userId: string): void {
    const chat = this.openChats[userId];
    const message = chat.newMessage.trim();
    if (!message) return;

    const chatMsg = {
      type: 'chat',
      toId: userId,
      fromId: this.wsService.userId,
      fromName: this.playerName,
      content: message
    };

    this.wsService.send(chatMsg);
    chat.messages.push(`You: ${message}`);
    chat.newMessage = '';
  }

  getGenderInitial(gender: string): string {
    if (!gender) return '';
    return gender.charAt(0).toUpperCase();
  }

  getOpenChatUserIds(): string[] {
    return Object.keys(this.openChats);
  }
  closeChat(userId: string): void {
  delete this.openChats[userId];
}
}