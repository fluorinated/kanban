import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '@models/ticket.model';

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
