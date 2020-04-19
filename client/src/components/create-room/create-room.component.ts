import { Component } from '@angular/core';

@Component({
  selector: 'create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent {
  playerName = '';

  // TODO: When room code generation service is available,
  // Add a parameter for the service related to it and
  // use it with onSubmit() method
  constructor() { }

  onSubmit(form) {
    console.log(form.value);
  }

}
