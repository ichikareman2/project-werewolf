import { Component, Input, OnChanges } from '@angular/core';
import { GamePhase, RolesEnum, getInstructionMessage } from 'src/models';

@Component({
  selector: 'game-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css']
})
export class GameInstructionComponent implements OnChanges {
    @Input() gamePhase: GamePhase;
    @Input() role: RolesEnum;
    instructionMessage: string;

    ngOnChanges() {
      this.instructionMessage = getInstructionMessage(this.gamePhase.dayOrNight, this.role);
    }
}
