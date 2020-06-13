import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from 'src/services/player.service';

@Component({
  selector: 'join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {
  playerName = '';
  loadForm = false;

  constructor(private playerService: PlayerService, private router: Router) {}

  async ngOnInit() {
    const player = await this.playerService.getPlayer();
    console.log('player', player);
    if ( player ) {
      return this.router.navigate(['/lobby']);
    }

    this.loadForm = true;
  }

  onSubmit(form) {
    this.playerService.registerPlayer(form.value.playerName);
  }
}
