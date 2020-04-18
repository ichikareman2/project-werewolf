import { Component } from '@angular/core';
import { LobbySocketService } from '../../services/lobby.service';

@Component({
  selector: 'lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {
  constructor(private lobbySocketService: LobbySocketService) {}
}
