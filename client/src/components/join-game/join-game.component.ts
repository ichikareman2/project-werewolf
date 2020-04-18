import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { PlayerService } from 'src/services/player.service';

@Component({
  selector: 'join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent {
  playerName = '';

  constructor(private playerService: PlayerService) {}

  onSubmit(form) {
    this.playerService.registerPlayer(form.value.playerName);
  }
}
