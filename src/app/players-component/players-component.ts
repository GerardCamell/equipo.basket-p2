import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetailComponent } from '../detail-component/detail-component';
import { Player } from '../detail-component/player.model';
import { PlayerFilterPipe } from '../pipes/player-filter-pipe';
import { Router } from '@angular/router';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
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
  
//Se conecta con la base de datos y obtenemos la ruta para ir a crear al jugador
  constructor(private firestore: Firestore, private router: Router) {
    const ref = collection(this.firestore, 'players');
    this.players$ = collectionData(ref, { idField: 'id' }) as Observable<Player[]>;
  }

  selectPlayer(p: Player) {
    this.selectedPlayer = p;
  }
  //Ir a la ruta para crear al nuevo player
  goToCreatePlayer() {
    this.router.navigate(['/create-player']);
  }
//Ir a la ruta para editar al player seleccionado
  goToEditPlayer(player:Player, event: Event) {
     event.stopPropagation();// Evita que se active goToPlayerSelected al hacer clic en el botón
     this.router.navigate([`/edit-player/${player.id}`]);
  }

   deletePlayer(player: Player, event: Event) {
    event.stopPropagation(); 

    // Alerta para asegurarse que queremos eliminar al player
    if (confirm(`¿Estás seguro de eliminar a ${player.name} ${player.lastName}?`)) {
      const playerDoc = doc(this.firestore, `players/${player.id}`);
      deleteDoc(playerDoc)
        .then(() => console.log('Jugador eliminado'))
        .catch(err => console.error('Error eliminando jugador', err));
    }
  }

  
}