import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() placeholder: string;
  @Input() value;
  @Input() options: string[];
  @Input() formControl: FormControl;
  @Input() isTextarea: boolean;
  @Input() h2: boolean = false;
  @Output() onKeyUp: EventEmitter<any> = new EventEmitter();
  @Output() onBlur: EventEmitter<any> = new EventEmitter();
  @Output() optionClicked: EventEmitter<string> = new EventEmitter();
  @ViewChild('input')
  input: ElementRef;
  @ViewChild('textarea')
  textarea: ElementRef;

  filteredOptions: Observable<string[]>;

  constructor() {}

  ngOnInit() {
    if (this.options) {
      this.filteredOptions = this.formControl?.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  keyUp() {
    this.onKeyUp.emit(this.input?.nativeElement?.value);
  }

  blurTextarea() {
    this.onBlur.emit(this.textarea?.nativeElement?.value);
  }
  blurInput() {
    this.onBlur.emit(this.input?.nativeElement?.value);
  }

  onOptionClick($event) {
    this.optionClicked.emit($event);
  }
}
