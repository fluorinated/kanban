import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';
import { Ticket } from '../models/ticket.model';

const baseUrl = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getBoardsPaginated(
    pageNumber: string,
    swimlaneTitle: string
  ): Observable<any> {
    return this.http.get<any>(
      `${baseUrl}/getBoardsPaginated?pageNumber=${pageNumber}&swimlaneTitle=${swimlaneTitle}`
    );
  }

  getBoardsOnlyTen(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/getBoardsOnlyTen`);
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${baseUrl}/getBoards`);
  }

  addNewBoardToBoards(): Observable<any> {
    return this.http.post(`${baseUrl}/addNewBoardToBoards`, this.httpOptions);
  }

  updateCurrentBoardTitle(title?: string, _id?: string): Observable<any> {
    return this.http.post(
      `${baseUrl}/updateCurrentBoardTitle`,
      JSON.stringify({ title, _id }),
      this.httpOptions
    );
  }

  setBoards(boards: Board[]): Observable<any> {
    return this.http.post(
      `${baseUrl}/setBoards`,
      JSON.stringify({ boards }),
      this.httpOptions
    );
  }

  deleteCurrentBoard(): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteCurrentBoard`, this.httpOptions);
  }

  deleteBoard(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteBoard/${id}`, this.httpOptions);
  }

  deleteCurrentBoardTag(tag: string): Observable<any> {
    return this.http.delete(
      `${baseUrl}/deleteCurrentBoardTag/${tag}`,
      this.httpOptions
    );
  }

  deleteTicket(ticketNumber: string): Observable<any> {
    return this.http.delete(
      `${baseUrl}/deleteTicket/${ticketNumber}`,
      this.httpOptions
    );
  }

  addCollapsedLaneToCurrentBoardSave(lane: string): Observable<any> {
    return this.http.post(
      `${baseUrl}/addCollapsedLaneToCurrentBoardSave`,
      JSON.stringify({ lane }),
      this.httpOptions
    );
  }

  removeCollapsedLaneFromCurrentBoardSave(lane: string): Observable<any> {
    return this.http.post(
      `${baseUrl}/removeCollapsedLaneFromCurrentBoardSave`,
      JSON.stringify({ lane }),
      this.httpOptions
    );
  }
}
