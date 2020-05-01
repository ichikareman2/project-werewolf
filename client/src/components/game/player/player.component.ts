import { Component, Input } from '@angular/core';
import { Player } from 'src/models';

@Component({
  selector: 'game-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class GamePlayerComponent {
  @Input() player: Player;
  @Input() isVote: boolean = false;
}
