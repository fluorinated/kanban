import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class ButtonComponent implements OnInit {
  @Output() buttonClicked: EventEmitter<void> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  click(): void {
    this.buttonClicked.emit();
  }
}
