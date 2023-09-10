import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '@models/ticket.model';
import { Board } from '@models/board.model';

// const baseUrl = 'https://kanban-service-heeh.onrender.com';
const baseUrl = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class SwimlaneService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getSwimlaneTicketsAtFirstPage(swimlaneTitle: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(
      `${baseUrl}/getSwimlaneTicketsAtFirstPage?swimlaneTitle=${swimlaneTitle}`
    );
  }

  getMaxPagesForSwimlane(
    currentBoard: Board,
    swimlaneTitle: string
  ): Observable<{ maxPages: string }> {
    const params = new HttpParams()
      .set('swimlaneTitle', swimlaneTitle)
      .set('currentBoard', JSON.stringify(currentBoard));

    return this.http.get<{ maxPages: string }>(
      `${baseUrl}/getMaxPagesForSwimlane`,
      { params }
    );
  }

  getCurrentBoardSwimlaneTicketsPaginated(
    pageNumber: string,
    swimlaneTitle: string
  ): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(
      `${baseUrl}/getCurrentBoardSwimlaneTicketsPaginated?pageNumber=${pageNumber}&swimlaneTitle=${swimlaneTitle}`
    );
  }

  getTicketsPaginatedWithinBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${baseUrl}/getTicketsPaginatedWithinBoards`);
  }

  addTicketToCurrentBoard(newTicket: Ticket): Observable<Object> {
    const body = JSON.stringify(newTicket);
    return this.http.post<Object>(
      `${baseUrl}/addTicketToCurrentBoard`,
      body,
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
  ): Observable<Object> {
    return this.http.post<Object>(
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
