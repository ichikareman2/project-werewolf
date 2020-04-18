import { Component } from '@angular/core';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent {
  playerName = '';

  constructor(private apiService: ApiService) {}

  onSubmit(form) {
    this.apiService
      .post('/player', { name: form.value.playerName })
      .subscribe(response => console.log(response));
  }
}
