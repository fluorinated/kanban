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

  getSwimlaneTicketsAtFirstPage(swimlaneTitle: string): Observable<any> {
    return this.http.get<any>(
      `${baseUrl}/getSwimlaneTicketsAtFirstPage?swimlaneTitle=${swimlaneTitle}`
    );
  }

  getMaxPagesForSwimlane(swimlaneTitle: string): Observable<any> {
    return this.http.get<any>(
      `${baseUrl}/getMaxPagesForSwimlane?swimlaneTitle=${swimlaneTitle}`
    );
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${baseUrl}/getBoards`);
  }

  getCurrentBoardSwimlaneTicketsPaginated(
    pageNumber: string,
    swimlaneTitle: string
  ): Observable<any> {
    return this.http.get<any>(
      `${baseUrl}/getCurrentBoardSwimlaneTicketsPaginated?pageNumber=${pageNumber}&swimlaneTitle=${swimlaneTitle}`
    );
  }

  addTicketToCurrentBoard(newTicket: Ticket): Observable<any> {
    const body = JSON.stringify(newTicket);
    return this.http.post(
      `${baseUrl}/addTicketToCurrentBoard`,
      body,
      this.httpOptions
    );
  }

  getNextTicketNumber(boardId?: string): Observable<any> {
    return this.http.get<any>(
      `${baseUrl}/getNextTicketNumber?boardId=${boardId}`
    );
  }

  addNewBoardToBoards(boards?: any): Observable<any> {
    const body = JSON.stringify(boards);
    return this.http.post(`${baseUrl}/addNewBoardToBoards`, body);
  }

  updateCurrentBoardTitle(title?: string, _id?: string): Observable<any> {
    return this.http.post(
      `${baseUrl}/updateCurrentBoardTitle`,
      JSON.stringify({ title, _id }),
      this.httpOptions
    );
  }

  updateTicketSwimlane(
    title?: string,
    ticketNumber?: string,
    currentIndex?: number,
    previousIndex?: number,
    previousSwimlaneTitle?: string,
    lanePageNumber?: string
  ): Observable<any> {
    return this.http.post(
      `${baseUrl}/updateTicketSwimlane`,
      JSON.stringify({
        title,
        ticketNumber,
        currentIndex,
        previousIndex,
        previousSwimlaneTitle,
        lanePageNumber,
      }),
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
