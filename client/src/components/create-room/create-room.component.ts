import { Component } from '@angular/core';

@Component({
  selector: 'create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent {
  playerName = '';
  constructor() { }

  onSubmit(form) {
    console.log(form.value);
  }

}
