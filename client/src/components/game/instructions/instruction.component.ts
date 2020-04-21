import { Component, Input } from '@angular/core';
import { GamePhase, RolesEnum, getInstructionMessage } from 'src/models';

@Component({
  selector: 'game-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css']
})
export class GameInstructionComponent {
    @Input() gamePhase: GamePhase;
    @Input() role: RolesEnum;
    instructionMessage: string = 'Welcome!';

    getInstruction() {
        this.instructionMessage = getInstructionMessage(this.gamePhase.dayOrNight, this.role);
    }
}
