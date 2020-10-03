import { Component } from '@angular/core';
@Component({
  selector: 'game-rules',
  templateUrl: './game-rules.component.html',
  styleUrls: ['./game-rules.component.css']
})
export class GameRulesComponent {
  activeContent = 'game-setup';

  handleChangeActiveContent(newContent) {
    this.activeContent = newContent;
  }
}
