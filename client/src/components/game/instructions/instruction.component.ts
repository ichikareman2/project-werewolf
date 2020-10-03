import { Component, Input, OnChanges } from '@angular/core';
import { GamePhase, RolesEnum, getInstructionMessage, getDeadInstructionMessage } from 'src/models';

@Component({
  selector: 'game-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css']
})
export class GameInstructionComponent implements OnChanges {
    @Input() gamePhase: GamePhase;
    @Input() role: RolesEnum;
    @Input() isAlive = false;
    instructionMessage: string;

    ngOnChanges() {
      this.instructionMessage = this.isAlive
        ? getInstructionMessage(this.gamePhase.dayOrNight, this.role)
        : getDeadInstructionMessage();
    }
}
