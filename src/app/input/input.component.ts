import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() placeholder: string;
  @Input() value;
  @Output() onKeyUp: EventEmitter<any> = new EventEmitter();
  @ViewChild('input')
  input: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  keyUp() {
    this.onKeyUp.emit(this.input?.nativeElement?.value);
  }
}
