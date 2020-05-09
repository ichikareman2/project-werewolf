import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { GamePhaseEnum } from 'src/models';

@Component({
  selector: 'game-phase',
  templateUrl: './phase.component.html',
  styleUrls: ['./phase.component.css']
})
export class GamePhaseComponent implements OnChanges {
  @Input() mode: GamePhaseEnum = GamePhaseEnum.NIGHT;
  @Input() round: number;
  @Input() isHost: boolean = false;
  @Output() restartActionHandler = new EventEmitter();

  phaseMessage = '';

  ngOnChanges() {
    this.phaseMessage = `${this.mode} ${this.round}`;
  }

  public handleRestartGame() {
    this.restartActionHandler.emit();
  }
}
