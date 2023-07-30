import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';

const baseUrl = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
   httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })};

  constructor(private http: HttpClient) {}

  getBoards(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/getBoards`);
  }

  getNextTicketNumber(boardId?: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/getNextTicketNumber?boardId=${boardId}`);
  }

  addNewBoardToBoards(boards?: any): Observable<any> {
    const body = JSON.stringify(boards);
    return this.http.post(`${baseUrl}/addNewBoardToBoards`, body);
  }

  updateCurrentBoardTitle(title?: string, _id?: string): Observable<any> {
    return this.http.post(`${baseUrl}/updateCurrentBoardTitle`, JSON.stringify({ title, _id }), this.httpOptions);
  }
  
  updateTicketSwimlane(title?: string, ticketNumber?: string, currentIndex?: number, previousIndex?: number): Observable<any> {
    return this.http.post(`${baseUrl}/updateTicketSwimlane`, JSON.stringify({ title, ticketNumber, currentIndex, previousIndex }), this.httpOptions);
  }

  setBoards(boards: Board[]): Observable<any> {
    return this.http.post(`${baseUrl}/setBoards`, JSON.stringify({ boards }), this.httpOptions);
  }

  // delete(id: any): Observable<any> {
  //   return this.http.delete(`${baseUrl}/${id}`);
  // }

  public drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
