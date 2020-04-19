import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { PlayerService } from 'src/services/player.service';

@Component({
  selector: 'join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {
  playerName = '';

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    const player = this.playerService.getPlayer();
    if( player ) {
      player.subscribe(response => {
        if( response ) {
          this.playerService.registerPlayer(response.name);
        }
      });
    }
  }

  onSubmit(form) {
    this.playerService.registerPlayer(form.value.playerName);
  }
}
