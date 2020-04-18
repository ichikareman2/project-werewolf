import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent {
  playerName = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(form) {
    this.apiService
      .post('/player', { name: form.value.playerName })
      .subscribe(response => {
        localStorage.setItem('werewolf-player-id', response.id);
        localStorage.setItem('werewolf-player-name', response.name);
        this.router.navigate(['/lobby']);
      });
  }
}
