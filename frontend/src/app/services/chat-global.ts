import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messages: { nick: string; text: string }[] = [];
  private socket!: WebSocket | null;
  private socketUrl = 'wss://localhost/api/chat-socket';
  
  messageReceived$ = new Subject<void>();

  connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.cleanupSocket();

    this.socket = new WebSocket(this.socketUrl);

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.messages.push(message);
        this.messageReceived$.next();
      } catch (e) {
        console.error('Error al parsear mensaje:', e);
      }
    };

    this.socket.onclose = () => {
      console.log('bSocket cerrado');
    };
  }

  sendMessage(text: string): void {
    const userNick = localStorage.getItem('nick') || 'Anónimo';
    const messagePayload = { nick: userNick, text: text };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(messagePayload));
    }
  }

  disconnect(): void {
    this.cleanupSocket();
    this.messages = []; 
    console.log('socket destruido');
  }


  private cleanupSocket(): void {
    if (this.socket) {
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      
      if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close();
      }
      this.socket = null;
    }
  }
}