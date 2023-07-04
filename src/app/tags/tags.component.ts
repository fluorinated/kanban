import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { TicketStore } from '../ticket/store/ticket-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit, OnChanges {
  @Input() tags: string[];
  @Input() noScroll: boolean = false;
  @Input() width: string;
  @Input() showCloseButton: boolean = false;

  @Output() closeClicked: EventEmitter<string> = new EventEmitter<string>();

  @ViewChildren('tagsList')
  tagsList: QueryList<ElementRef>;

  tagsMap = new Map();
  tagsMap$: Observable<Map<string, string>>;

  constructor(private ticketStore: TicketStore) {}

  ngOnInit(): void {
    this.tagsMap$ = this.ticketStore.getTagsMap$;
  }

  ngOnChanges(): void {
    this.tagsList?.changes?.subscribe((changes: QueryList<ElementRef>) => {
      changes.forEach((res) => {
        let num =
          res?.nativeElement?.offsetLeft + res?.nativeElement?.offsetWidth;
        num = `${num}px`;
        this.tagsMap.set(res?.nativeElement?.innerText, num);
        this.ticketStore.setTagsMap(this.tagsMap);
      });
    });
  }

  ngAfterContentChecked(): void {
    if (this.tagsList) {
      this.tagsList['_results'].map((res) => {
        let num =
          res?.nativeElement?.offsetLeft + res?.nativeElement?.offsetWidth;
        num = `${num}px`;
        this.tagsMap.set(res?.nativeElement?.innerText, num);
        this.ticketStore.setTagsMap(this.tagsMap);
      });
    }
  }

  close(tag: string) {
    this.closeClicked.emit(tag);
  }
}
