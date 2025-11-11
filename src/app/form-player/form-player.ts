import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Player } from '../detail-component/player.model';
import { Firestore, addDoc, collection, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Router,  ActivatedRoute} from '@angular/router';



@Component({
  selector: 'app-form-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-player.html',
  styleUrl: './form-player.css',
})
export class FormPlayer implements  OnInit {

  newPlayer: Player = new Player();
  selectedFile: File | null = null;
  isEditMode =false;

  constructor(private firestore: Firestore, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.isEditMode = true; // cambia a modo edición
    this.loadPlayer(id);    // cargar los datos de newPlayer
  }
}
  async loadPlayer(id: string) {
    const playerRef = doc(this.firestore, `players/${id}`);
    const docSnap = await getDoc(playerRef);
    if (docSnap.exists()) {
      this.newPlayer = docSnap.data() as Player;
      this.newPlayer.id = id; //asignar  un id al jugador 
    }
  }

   async createPlayer() {
    this.isEditMode = false;
    try {
      const playersRef = collection(this.firestore, 'players');
      const playerToSave = { ...this.newPlayer };
      delete (playerToSave as any).id;

      await addDoc(playersRef, playerToSave);

      alert(`Jugador "${this.newPlayer.name}" agregado correctamente`);//mensaje de creacion con exito

      this.router.navigate(['/players']);// para volver a players

    } catch (err: any) {
      console.error(' Error al agregar jugador:', err);
      alert(' Error al crear jugador: ' + err.message);
    }
    this.router.navigate(['/players']);
  }

   async updatePlayer() {
    this.isEditMode = true;
    try {
        const playerRef = doc(this.firestore, `players/${this.newPlayer.id}`);
        const playerToSave = { ...this.newPlayer };
        delete (playerToSave as any).id; // Firebase no guarda el id como campo
        await updateDoc(playerRef, playerToSave);

        alert(`Jugador "${this.newPlayer.name}" actualizado correctamente`);
        this.router.navigate(['/players']);
    } catch (err: any) {
      console.error('Error al guardar jugador:', err);
      alert('Error al guardar jugador: ' + err.message);
    }
  }
}