import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  instruction: string = '';
  mode: string = '';
  players: any[] = [];

  constructor() {}

  ngOnInit(): void {
    console.log('game component');
  }
}
