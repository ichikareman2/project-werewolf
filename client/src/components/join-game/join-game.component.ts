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

  constructor(private playerService: PlayerService, private router: Router) {}

  async ngOnInit() {
    const player = await this.playerService.getPlayer();
    if( player ) {
      this.router.navigate(['/lobby']);
    }
  }

  onSubmit(form) {
    this.playerService.registerPlayer(form.value.playerName);
  }
}
