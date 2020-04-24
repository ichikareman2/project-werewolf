import { Component, Input, OnChanges } from '@angular/core';
import { getPhaseMessage, GamePhaseEnum } from 'src/models';

@Component({
  selector: 'game-phase',
  templateUrl: './phase.component.html',
  styleUrls: ['./phase.component.css']
})
export class GamePhaseComponent implements OnChanges {
  @Input() mode: GamePhaseEnum = GamePhaseEnum.NIGHT;
  phaseMessage: string = '';

  ngOnChanges() {
    this.phaseMessage = getPhaseMessage(this.mode);
  }
}
