import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
    @Input() modalId: string;
    @Input() header: string;
    @Input() message: string;
    @Input() primaryButtonLabel = 'OK';
    @Output() primaryActionHandler = new EventEmitter();
    @Output() secondaryActionHandler = new EventEmitter();

    public handlePrimaryButtonClick() {
      this.primaryActionHandler.emit();
    }

    public handleSecondaryButtonClick() {
      this.secondaryActionHandler.emit();
    }
}
