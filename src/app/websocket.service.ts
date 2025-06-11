import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
private socket: WebSocket | null = null;
  private messageCallback: ((msg: any) => void) | null = null;
  private joinPayload: any = null;
  userId: string | null = null;

  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      if (this.joinPayload) {
        this.sendJoin(this.joinPayload);
      }
    };

    this.socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'init') {
        this.userId = msg.userId;
      }
      if (this.messageCallback) {
        this.messageCallback(msg);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  }

  onMessage(callback: (msg: any) => void): void {
    this.messageCallback = callback;
  }

  send(msg: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(msg));
    } else {
      console.warn('WebSocket not open — cannot send:', msg);
    }
  }

  autoJoin(payload: any): void {
    this.joinPayload = payload;
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.sendJoin(payload);
    }
    // Else: will send automatically when socket opens
  }

  private sendJoin(payload: any): void {
    const joinMsg = {
      type: 'join',
      ...payload
    };
    this.send(joinMsg);
    console.log('Sent join:', joinMsg);
  }
}


