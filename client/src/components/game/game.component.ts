import { Component, OnInit } from '@angular/core';
import { GamePhase, RolesEnum, GamePhaseEnum, DayPhaseEnum, Player } from 'src/models';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  players: Player[] = [
    {
      id: '1',
      name: 'Player 1',
      isHost: true
    },
    {
      id: '2',
      name: 'Player 2',
      isHost: false
    }
  ];
  gamePhase: GamePhase = {
    dayOrNight: GamePhaseEnum.NIGHT,
    roundPhase: DayPhaseEnum.VILLAGERSVOTE
  }
  role: RolesEnum = RolesEnum.VILLAGER;

  constructor() {
    const roles = [
      RolesEnum.VILLAGER,
      RolesEnum.WEREWOLF,
      RolesEnum.SEER
    ];

    setInterval(() => {
      const i = (Math.ceil(Math.random() * roles.length)) % roles.length;
      this.role = roles[i];
    }, 5000);
  }

  ngOnInit(): void {}
}
