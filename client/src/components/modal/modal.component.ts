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
    @Input() primaryButtonLabel: string = 'OK';
    @Output() primaryActionHandler = new EventEmitter<void>();

    public handlePrimaryButtonClick() {
      this.primaryActionHandler.emit();
    }
}
