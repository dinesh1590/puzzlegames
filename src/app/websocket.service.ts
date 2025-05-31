import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
private socket!: WebSocket;

  connect(url: string): void {
    this.socket = new WebSocket(url);
  }

  send(data: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      this.socket.addEventListener('open', () => {
        this.socket.send(JSON.stringify(data));
      });
    }
  }

  onMessage(callback: (data: any) => void): void {
    this.socket.onmessage = (event) => {
      callback(JSON.parse(event.data));
    };
  }

  close(): void {
    this.socket.close();
  }
}