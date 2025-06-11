import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
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
export class ChatComponent implements AfterViewChecked {
 @ViewChild('scrollContainer') scrollContainer!: ElementRef;
 @ViewChild('messageInput') messageInput!: ElementRef;

  playerName = '';
  playerAge: number | null = null;
  playerGender = '';
  joined = false;

  

  onlineUsers: any[] = [];
  openChats: { [userId: string]: { user: any, messages: string[], newMessage: string, minimized: boolean,typing?: boolean } } = {};

  constructor(private wsService: WebsocketService) {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

   scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  toggleMinimize(userId: string): void {
  this.openChats[userId].minimized = !this.openChats[userId].minimized;
}

  joinChat(): void {

  if (this.playerName.length < 3) {
    alert('Name must be at least 3 letters long.');
    return;
  }

     this.playerName = this.playerName.slice(0, 10);

    if (!this.playerAge || this.playerAge < 18 || this.playerAge > 100 ) {
    alert('you are not allowed to chat here go back...');
    return;
  }

    this.wsService.connect('ws://localhost:8080/ws');
    //this.wsService.connect('wss://nanopg-production.up.railway.app/ws');

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
            newMessage: '',
             minimized: false
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
        newMessage: '',
         minimized: false
      };
    }
  }

  onTyping(userId: string): void {
  if (!this.wsService.userId) return;

  this.wsService.send({
    type: 'typing',
    fromId: this.wsService.userId,
    toId: userId,
    fromName: this.playerName
  });
}

  sendMessage(userId: string): void {
    const chat = this.openChats[userId];
    const message = chat.newMessage.trim();
  if (!message) return;

 const disallowed = /(http.*\.(jpg|jpeg|png|gif|mp4|avi|mov|webm))/i;
  if (disallowed.test(message)) {
    alert('Photos and videos are not allowed.');
    return;
  }
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

    setTimeout(() => {
    this.messageInput?.nativeElement.focus();
  }, 0);
  }

  getGenderInitial(gender: string): string {
    if (!gender) return '';
    return gender.charAt(0).toUpperCase();
  }

isMyMessage(msg: string): boolean {
  return msg.startsWith('You:');
}

  getOpenChatUserIds(): string[] {
    return Object.keys(this.openChats);
  }
  closeChat(userId: string): void {
  delete this.openChats[userId];
}
}