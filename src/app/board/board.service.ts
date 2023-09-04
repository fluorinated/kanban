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
    }),
  };

  constructor(private http: HttpClient) {}

  getBoardsPaginated(
    pageNumber: string,
    swimlaneTitle: string
  ): Observable<Board[]> {
    return this.http.get<Board[]>(
      `${baseUrl}/getBoardsPaginated?pageNumber=${pageNumber}&swimlaneTitle=${swimlaneTitle}`
    );
  }

  getBoardsOnlyTenInEachSwimlane(): Observable<Board[]> {
    return this.http.get<Board[]>(`${baseUrl}/getBoardsOnlyTenInEachSwimlane`);
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${baseUrl}/getBoards`);
  }

  addNewBoardToBoards(): Observable<any> {
    return this.http.post(`${baseUrl}/addNewBoardToBoards`, this.httpOptions);
  }

  updateCurrentBoardTitle(title?: string, _id?: string): Observable<Object> {
    return this.http.post<Object>(
      `${baseUrl}/updateCurrentBoardTitle`,
      JSON.stringify({ title, _id }),
      this.httpOptions
    );
  }

  updateCurrentBoardStatus(id?: string): Observable<Object> {
    return this.http.post<Object>(
      `${baseUrl}/updateCurrentBoardStatus`,
      JSON.stringify({ id }),
      this.httpOptions
    );
  }

  setBoards(boards: Board[]): Observable<Object> {
    return this.http.post<Object>(
      `${baseUrl}/setBoards`,
      JSON.stringify({ boards }),
      this.httpOptions
    );
  }

  deleteCurrentBoard(): Observable<Object> {
    return this.http.delete<Object>(
      `${baseUrl}/deleteCurrentBoard`,
      this.httpOptions
    );
  }

  deleteBoard(id: string): Observable<Object> {
    return this.http.delete<Object>(
      `${baseUrl}/deleteBoard/${id}`,
      this.httpOptions
    );
  }

  deleteCurrentBoardTag(tag: string): Observable<Object> {
    return this.http.delete<Object>(
      `${baseUrl}/deleteCurrentBoardTag/${tag}`,
      this.httpOptions
    );
  }

  deleteTicket(ticketNumber: string): Observable<Object> {
    return this.http.delete<Object>(
      `${baseUrl}/deleteTicket/${ticketNumber}`,
      this.httpOptions
    );
  }

  addCollapsedLaneToCurrentBoardSave(lane: string): Observable<Object> {
    return this.http.post<Object>(
      `${baseUrl}/addCollapsedLaneToCurrentBoardSave`,
      JSON.stringify({ lane }),
      this.httpOptions
    );
  }

  removeCollapsedLaneFromCurrentBoardSave(lane: string): Observable<Object> {
    return this.http.post<Object>(
      `${baseUrl}/removeCollapsedLaneFromCurrentBoardSave`,
      JSON.stringify({ lane }),
      this.httpOptions
    );
  }
}
