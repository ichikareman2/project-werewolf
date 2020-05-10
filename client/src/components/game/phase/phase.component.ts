import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { GamePhaseEnum } from 'src/models';

declare var $: any;

@Component({
  selector: 'game-phase',
  templateUrl: './phase.component.html',
  styleUrls: ['./phase.component.css']
})
export class GamePhaseComponent implements OnChanges {
  @Input() mode: GamePhaseEnum = GamePhaseEnum.NIGHT;
  @Input() round: number;
  @Input() isHost = false;
  @Output() restartActionHandler = new EventEmitter();
  phaseMessage = '';
  modalId = 'modal-restart-confirm';

  ngOnChanges() {
    this.phaseMessage = `${this.mode} ${this.round}`;
  }

  public confirmRestartGame() {
    $(`#${this.modalId}`).modal('show');
  }

  public handleRestartGame() {
    $(`#${this.modalId}`).modal('hide');
    this.restartActionHandler.emit();
  }
}
