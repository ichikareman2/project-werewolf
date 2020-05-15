import { Component, Input, OnChanges, OnInit, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { Player } from 'src/models';

@Component({
  selector: 'game-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamePlayerComponent implements OnInit, OnChanges {
  @Input() player: Player;
  @Input() showVote: boolean;
  roleImage: string;
  voteText: string;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( this.showVote ) {
      this.voteText = this.player.vote
        ? `Voted ${this.player.vote.name}`
        : 'Hasn\'t voted yet';
    }
    const roleImage = `assets/images/roles/${this.player.role.toLowerCase()}.png`;
    if (roleImage !== this.roleImage) { this.roleImage = roleImage }
  }
}
