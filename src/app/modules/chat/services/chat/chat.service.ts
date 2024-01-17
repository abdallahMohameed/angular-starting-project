import { Injectable } from '@angular/core';
// import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatDataService } from '../chatData/chat-data.service';
import { ChatMessage } from '../../interfaces/chat-message';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    // openai!: OpenAIApi;

    messages: ChatMessage[] = [];
    private messagesSubject = new BehaviorSubject<ChatMessage[]>(
        []
    );

    constructor(private chatDataService: ChatDataService, private http: HttpClient) {
    }
    private handleError(error: any): Observable<never> {
        const errorMessage = `API request failed. Error: ${error.message}`;
        console.error(errorMessage);
        return throwError(errorMessage);
    }
    async createCompletionViaLocalAI(messages: ChatMessage[]) {
        try {
            const isUserRole = (messages:ChatMessage) => messages.role === "user";

            const lastUserMessageContent = messages.slice().reverse().find(isUserRole)?.content;


            const apiUrl = 'https://localhost:52914/Chat/Send';

            const requestObject = { text: lastUserMessageContent };

            const response = await this.http.post(apiUrl, requestObject, { responseType: 'text' }).toPromise();

            // Return the response as a string
            return response?.replace("User:", '');
        } catch (error) {
            console.error('Error in createCompletionViaLocalAI:', error);
            throw error; // Rethrow the error to handle it at the caller level if needed.
        }
    }

    public setMessagesSubject(event: ChatMessage[]) {
        this.messagesSubject.next(event);
    }

    public getMessagesSubject(): Observable<ChatMessage[]> {
        return this.messagesSubject.asObservable();
    }
}
