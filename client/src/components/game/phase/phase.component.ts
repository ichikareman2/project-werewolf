import { Component, Input } from '@angular/core';

@Component({
  selector: 'game-phase',
  templateUrl: './phase.component.html',
  styleUrls: ['./phase.component.css']
})
export class GamePhaseComponent {
  @Input() mode: string = '';
}
