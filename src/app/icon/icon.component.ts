import { Component, Input } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  faPlus = faPlus;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faFilter = faFilter;
  faClose = faClose;
  faPencil = faPencil;
  @Input() set icon(icon: string) {
    this.faIcon = this.iconMap.get(icon);
  }
  @Input() set color(color: string) {
    this.iconColor = this.colorMap.get(color);
  }
  faIcon;
  iconColor;
  iconMap = new Map([
    ['faPlus', faPlus],
    ['faAngleLeft', faAngleLeft],
    ['faAngleRight', faAngleRight],
    ['faFilter', faFilter],
    ['faClose', faClose],
    ['faPencil', faPencil],
  ]);
  colorMap = new Map([
    ['pink-1', 'var(--pink-1)'],
    ['neutral-2', 'var(--neutral-2)'],
  ]);
}
