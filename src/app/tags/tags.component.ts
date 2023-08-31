import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements AfterViewInit {
  @Input() tags: string[];
  @Input() noScroll: boolean = false;
  @Input() width: string;
  @Input() showCloseButton: boolean = false;

  @Output() closeClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() tagClicked: EventEmitter<void> = new EventEmitter<void>();

  @ViewChildren('tagsList')
  tagsList: QueryList<ElementRef>;

  @ViewChild('tagsContainer', { static: false }) tagsContainer: ElementRef;

  constructor() {}

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

  close($event: Event, tag: string) {
    $event.stopPropagation();
    this.closeClicked.emit(tag);
  }

  onTagClick($event: Event) {
    $event.stopPropagation();
    this.tagClicked.emit();
  }
}
