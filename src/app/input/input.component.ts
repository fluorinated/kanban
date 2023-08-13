import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit, OnChanges {
  @Input() placeholder: string;
  @Input() value: string;
  @Input() options: string[];
  @Input() isTextarea: boolean;
  @Input() h2: boolean = false;
  @Output() onKeyUp: EventEmitter<string> = new EventEmitter();
  @Output() onBlur: EventEmitter<string> = new EventEmitter();
  @Output() optionClicked: EventEmitter<string> = new EventEmitter();
  @Output() deleteOptionClicked: EventEmitter<string> = new EventEmitter();
  @ViewChild('input', { static: false })
  input: ElementRef;
  @ViewChild('textarea', { static: false })
  textarea: ElementRef;

  filteredOptions: Observable<string[]>;

  form: FormGroup;

  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      control: new FormControl(''),
    });
    if (this.options) {
      this.filteredOptions = this.form?.controls?.control?.valueChanges?.pipe(
        startWith(''),
        map((value) => this._filter(value || '', this.options))
      );
    }
  }

  ngOnChanges() {
    if (this.options) {
      this.filteredOptions = this.form?.controls?.control?.valueChanges?.pipe(
        startWith(''),
        map((value) => this._filter(value || '', this.options))
      );
    }
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value?.toLowerCase();

    return options?.filter((option) =>
      option?.toLowerCase().includes(filterValue)
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

  deleteOption($event) {
    this.deleteOptionClicked.emit($event);
  }
}
