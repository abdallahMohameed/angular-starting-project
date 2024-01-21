import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ElementRef
} from '@angular/core';
import gsap from 'gsap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService } from '../../services/chat/chat.service';
import { ChatCompletionRequestMessageRoleEnum, ChatMessage } from '../../interfaces/chat-message';
import { HighlightService } from '../../services/HighlightService/highlight.service';

@Component({
    selector: 'app-chat-content',
    templateUrl: './chat-content.component.html',
    styleUrls: ['./chat-content.component.scss']
})
export class ChatContentComponent
implements OnInit, AfterViewChecked, AfterViewInit
{
    isLightMode = false;
    constructor(
    private chatService: ChatService,
    private highlightService: HighlightService
    ) {}

  @ViewChild('window') window!: any;
  public messages: ChatMessage[] = [];
  apiKey: string | null = '';
  isBusy = false;
  currChatSelected = '';
  @ViewChild('textInput', { static: true }) textInputRef!: ElementRef;

  ngOnInit(): void {
      this.scrollToBottom();

      // Subscribe to messages
      this.chatService.getMessagesSubject().subscribe((messages) => {
          this.messages = messages;
      });


  }
  toggleTheme() {
      this.isLightMode = !this.isLightMode;
  }

  ngAfterViewInit() {
      this.setupAnimation();
      this.textInputRef.nativeElement.focus();
  }

  ngAfterViewChecked(): void {
      this.scrollToBottom();
      this.highlightService.highlightAll();
  }

  async createCompletion(element: HTMLTextAreaElement) {
      if (this.isBusy != true) {
          const prompt = element.value;
          if (prompt.length <= 1 || this.isBusy) {
              element.value = '';
              return;
          }
          element.value = '';
          const message: ChatMessage = {
              role: ChatCompletionRequestMessageRoleEnum.User,
              content: prompt
          };

          this.messages.push(message);
          try {
              this.isBusy = true;
              setTimeout(() => {
                  this.setupAnimation();
              }, 10);

              const completion = await this.chatService.createCompletionViaLocalAI(this.messages);
              const responseMessage: ChatMessage = {
                  role:ChatCompletionRequestMessageRoleEnum.Assistant,
                  content: completion
              };

              this.messages.push(responseMessage);
          } catch (err) {
              const errorResponseMessage: ChatMessage = {
                  role:ChatCompletionRequestMessageRoleEnum.Assistant,
                  content: 'error in server'
              };

              this.messages.push(errorResponseMessage);
          }

          this.chatService.setMessagesSubject(this.messages);
          this.isBusy = false;
          this.scrollToBottom();

      }

  }

  scrollToBottom() {
      window.scrollTo(0, document.body.scrollHeight);
  }
  private setupAnimation(): void {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

      tl.to(".left, .right", { duration: 0.4, x: 5 });
      tl.to(".topLid", { duration: 0.1, y: -50 });
      tl.to(".btmLid", { duration: 0.1, y: 50 }, "<");
      tl.to(".topLid", { duration: 0.1, y: 0 });
      tl.to(".btmLid", { duration: 0.1, y: 0 }, "<");
      tl.to(".topLid", { duration: 0.1, y: -50 });
      tl.to(".btmLid", { duration: 0.1, y: 50 }, "<");
      tl.to(".left, .right", { duration: 0.4, x: 30 }, "+=2");
      tl.to(".left, .right", { duration: 0.5, x: -25 });
      tl.to(".left, .right", { duration: 0.4, x: 30 }, "+=.5");
      tl.to(".topLid", { duration: 0.1, y: 0 });
      tl.to(".btmLid", { duration: 0.1, y: 0 }, "<");
      tl.to(".topLid", { duration: 0.1, y: -50 });
      tl.to(".btmLid", { duration: 0.1, y: 50 }, "<");
      tl.to(".left, .right", { duration: 0.4, x: -25 });
      tl.to(".left, .right", { duration: 2.5, rotate: 360 }, "+=1");
      tl.to(".left, .right", { duration: 0.4, x: 5 }, "+=1");
      setTimeout(() => {
          this.scrollToBottom();

      }, 100);
  }
}
