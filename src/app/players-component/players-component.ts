import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailComponent } from '../detail-component/detail-component';
import { Player } from '../detail-component/player.model';
import { PlayerFilterPipe } from '../pipes/player-filter-pipe';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-players-component',
  standalone: true,
  imports: [CommonModule, FormsModule, DetailComponent, PlayerFilterPipe],
  templateUrl: './players-component.html',
  styleUrl: './players-component.css'
})
export class PlayersComponent {

  
  searchText: string = '';
  filterBy: string = 'name';

  
  players$: Observable<Player[]>;

  
  selectedPlayer: Player | null = null;

  constructor(private firestore: Firestore) {
    const ref = collection(this.firestore, 'players');
    this.players$ = collectionData(ref, { idField: 'id' }) as Observable<Player[]>;
  }

  selectPlayer(p: Player) {
    this.selectedPlayer = p;
  }
}