import { Component, Input, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  faPlus = faPlus;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faFilter = faFilter;
  faClose = faClose;
  faCheck = faCheck;
  faTrash = faTrash;
  @Input() set size(size: string) {
    if (this.sizeMap.has(size)) {
      this.iconSize = this.sizeMap.get(size);
    }
  }
  @Input() set icon(icon: string) {
    this.faIcon = this.iconMap.get(icon);
  }
  @Input() set color(color: string) {
    this.iconColor = this.colorMap.get(color);
  }
  faIcon;
  iconColor;
  iconSize;
  iconMap = new Map([
    ['faPlus', faPlus],
    ['faAngleLeft', faAngleLeft],
    ['faAngleRight', faAngleRight],
    ['faFilter', faFilter],
    ['faClose', faClose],
    ['faCheck', faCheck],
    ['faTrash', faTrash],
  ]);
  colorMap = new Map([
    ['pink-1', 'var(--pink-1)'],
    ['neutral-2', 'var(--neutral-2)'],
    ['neutral-5', 'var(--neutral-5)'],
  ]);
  sizeMap = new Map([
    ['small', 'fa-sm'],
    ['default', 'fa-2x'],
  ]);

  ngOnInit(): void {
    if (!this.iconSize) {
      this.iconSize = this.sizeMap.get('default');
    }
  }
}
