import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Player } from './detail-component/player.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playersCollection;

  constructor(private firestore: Firestore) {
    this.playersCollection = collection(this.firestore, 'players');
  }

  //CRUD metodos service.

  createPlayer(player:Player){
    //Create jugador
    return addDoc(this.playersCollection, player);
  }

  readPlayers():Observable<Player[]> {
    //Read jugadores
    return collectionData(this.playersCollection, { idField: 'id' }) as Observable<Player[]>;
  }
  
  updatePlayer(player:Player){
    //Update de los jugadores
    const playerDoc =  doc(this.firestore, `players/${player.id}`);
    // Excluimos el id del objeto para no actualizarlo en FireStore
    const { id, ...playerData } = player;
    return updateDoc(playerDoc, playerData);
  }  

  deletePlayer(playerId:number){
    //Delete del jugador
    const playerDoc =  doc(this.firestore, `players/${playerId}`);
    return deleteDoc(playerDoc);
  }

}