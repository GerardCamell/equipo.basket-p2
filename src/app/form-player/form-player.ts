import { Component, EventEmitter, Output } from '@angular/core';
import { Player } from '../detail-component/player.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-player',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-player.html',
  styleUrl: './form-player.css',
})
export class FormPlayer {
uploadFile($event: Event) {
throw new Error('Method not implemented.');
}
  newPlayer: Player = new Player();

  @Output() onAdd = new EventEmitter<Player>();

  createPlayer() {
    this.onAdd.emit(this.newPlayer);
    this.newPlayer = new Player();
  };
  



} 

