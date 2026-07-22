import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ChatService } from '../../services/chat-global';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-global',
  standalone: true,
  imports: [],
  templateUrl: './chat-global.html',
  styleUrl: './chat-global.css',
})
export class ChatGlobal implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  currentUserNick: string = '';

  get messages() {
    return this.chatService.messages;
  }

  private sub!: Subscription;

  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.currentUserNick = localStorage.getItem('nick') || 'Anonymous';

    this.chatService.connect();
    
    this.sub = this.chatService.messageReceived$.subscribe(() => {
      this.cdr.detectChanges();
      this.scrollToBottom();
    });

    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  sendMessage(inputElement: HTMLInputElement): void {
    const text = inputElement.value.trim();
    if (!text) return;

    this.chatService.sendMessage(text);
    inputElement.value = '';
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }
}