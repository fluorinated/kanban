import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

import { Ticket } from '../models/ticket.model';

@Component({
  selector: 'app-ready-to-start-lane',
  templateUrl: './ready-to-start-lane.component.html',
  styleUrls: ['./ready-to-start-lane.component.scss'],
})
export class ReadyToStartLaneComponent {
  // @Input() tickets: Ticket[];
  tickets: Ticket[] = [
    {
      title: 'pack clothes for travel to indianapolis',
      ticketNumber: 'MD-622',
      description: '* pack away clothes',
      tags: ['chore', 'fun'],
      dueDate: 'friday, may 26, 2023',
      createdDate: 'tuesday, may 16, 2023',
      swimlaneTitle: 'rdy 2 start',
      index: 0,
    },
    {
      title: 'pick out outfits for the upcoming show',
      ticketNumber: 'MD-624',
      description: '* pack away clothes',
      tags: ['chore', 'fun'],
      dueDate: 'friday, may 26, 2023',
      createdDate: 'tuesday, may 16, 2023',
      swimlaneTitle: 'rdy 2 start',
      index: 1,
    },
  ];

  drop(event: CdkDragDrop<Ticket[]>) {
    if (event.container.id === event.previousContainer.id) {
      // move inside same list
      console.log('event id same', event);

      moveItemInArray(this.tickets, event.previousIndex, event.currentIndex);
      // event.item.data.index = event.currentIndex;
      console.log('event currentIndex', event.currentIndex);
      console.log('event previousIndex', event.previousIndex);
    } else {
      // move between lists
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
