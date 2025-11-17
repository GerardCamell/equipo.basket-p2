import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Player } from '../detail-component/player.model';
import { Firestore, addDoc, collection, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Router,  ActivatedRoute, RouterModule} from '@angular/router';


@Component({
  selector: 'app-form-player',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './form-player.html',
  styleUrl: './form-player.css',
})
export class FormPlayer implements  OnInit {

  newPlayer: Player = new Player();
  selectedFile: File | null = null;
  selectedVideo: File | null = null;
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      return;
    }
    this.selectedFile = input.files[0];
  }

  onSelectedVideo(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.selectedVideo = null;
      return;
    }
    this.selectedVideo = input.files[0];
  }

  private async uploadHeadshot(): Promise<string | null> {
  if (!this.selectedFile) return null;
  const formData = new FormData();
  formData.append('file', this.selectedFile);
  formData.append('firstName', this.newPlayer.name);
  formData.append('lastName', this.newPlayer.lastName);

  try {
    const resp = await fetch('http://localhost:3000/upload-headshot', {
      method: 'POST',
      body: formData
    });
    const data = await resp.json();
    return data.url;
  } catch (err) {
    console.error(err);
    return null;
  }
}

private async uploadVideo(): Promise<string | null> {
  if (!this.selectedVideo) return null;
  const formData = new FormData();
  formData.append('file', this.selectedVideo);
  formData.append('videoName', `${this.newPlayer.name}_${this.newPlayer.lastName}`);

  try {
    const resp = await fetch('http://localhost:3000/upload-video', {
      method: 'POST',
      body: formData
    });
    const data = await resp.json();
    return data.url;
  } catch (err) {
    console.error(err);
    return null;
  }
}


async createPlayer() {
  this.isEditMode = false;
    try {
      if (this.selectedFile) 
          this.newPlayer.headshot = (await this.uploadHeadshot()) || '';

      if (this.selectedVideo) 
          this.newPlayer.video = (await this.uploadVideo()) || '';

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
        if (this.selectedFile) 
          this.newPlayer.headshot = (await this.uploadHeadshot()) || '';

        if (this.selectedVideo) 
            this.newPlayer.video = (await this.uploadVideo()) || '';
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