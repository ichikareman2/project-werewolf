import { Component } from '@angular/core';

@Component({
  selector: 'join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent {
  playerName = '';

  onSubmit(form) {
    console.log(form.value);
  }
}
