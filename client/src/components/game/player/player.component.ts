import { Component, Input, OnChanges } from '@angular/core';
import { Player } from 'src/models';

@Component({
  selector: 'game-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class GamePlayerComponent implements OnChanges {
  @Input() player: Player;
  @Input() showVote: boolean;
  voteText: string;

  ngOnChanges() {
    if ( this.showVote ) {
      this.voteText = this.player.vote
        ? `Voted ${this.player.vote.name}`
        : 'Hasn\'t voted yet';
    }
  }
}
