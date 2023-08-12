import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { TicketStore } from '../ticket/store/ticket-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit, AfterViewInit {
  @Input() tags: string[];
  @Input() noScroll: boolean = false;
  @Input() width: string;
  @Input() showCloseButton: boolean = false;

  @Output() closeClicked: EventEmitter<string> = new EventEmitter<string>();

  @ViewChildren('tagsList')
  tagsList: QueryList<ElementRef>;

  @ViewChild('tagsContainer', { static: false }) tagsContainer: ElementRef;

  tagsMap = new Map();
  tagsMap$: Observable<Map<string, string>>;

  constructor(private ticketStore: TicketStore) {}

  ngOnInit(): void {
    this.tagsMap$ = this.ticketStore.getTagsMap$;
  }

  ngAfterViewInit(): void {
    this.tagsList.changes.subscribe(() => {
      this.updateTagPositions();
    });
  }

  updateTagPositions(): void {
    const scrollOffset = this.tagsContainer.nativeElement.scrollLeft;

    let accumulatedWidth = 0;
    this.tagsList.forEach((tagElement) => {
      const tagWidth = tagElement.nativeElement.offsetWidth;
      const newPosition = accumulatedWidth + scrollOffset;
      tagElement.nativeElement.style.left = `${newPosition}px`;
      accumulatedWidth += tagWidth;
    });
  }

  close(tag: string) {
    this.closeClicked.emit(tag);
  }
}
