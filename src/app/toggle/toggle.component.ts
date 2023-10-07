import { Component, Input } from '@angular/core';
import { SwimlaneStore } from '../swimlane/store/swimlane-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
})
export class ToggleComponent {
  @Input() leftText: string;
  @Input() rightText: string;

  isDueFilterOn$: Observable<boolean>;

  constructor(private swimlaneStore: SwimlaneStore) {
    this.isDueFilterOn$ = this.swimlaneStore.isDueFilterOn$;
  }

  onSlide(): void {
    this.swimlaneStore.toggleIsDueFilterOn();
  }
}
