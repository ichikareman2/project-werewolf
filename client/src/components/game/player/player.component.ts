import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Player } from 'src/models';

@Component({
  selector: 'game-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class GamePlayerComponent implements OnInit, OnChanges {
  @Input() player: Player;
  @Input() showVote: boolean;
  roleImage: string;
  voteText: string;

  ngOnInit() {
    this.roleImage = `assets/images/roles/${this.player.role.toLowerCase()}.png`;
  }

  ngOnChanges() {
    if ( this.showVote ) {
      this.voteText = this.player.vote
        ? `Voted ${this.player.vote.name}`
        : 'Hasn\'t voted yet';
    }
  }
}
