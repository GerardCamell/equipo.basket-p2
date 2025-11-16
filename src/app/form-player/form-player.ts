import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Player } from '../detail-component/player.model';
import { Firestore, addDoc, collection, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-form-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-player.html',
  styleUrls: ['./form-player.css'],
})
export class FormPlayer implements OnInit {

  newPlayer: Player = new Player();
  selectedPhoto: File | null = null;
  selectedVideo: File | null = null;
  previewPhoto: string | null = null;
  previewVideo: string | null = null;
  isEditMode = false;

  constructor(private firestore: Firestore, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadPlayer(id);
    }
  }

  async loadPlayer(id: string) {
    const playerRef = doc(this.firestore, `players/${id}`);
    const docSnap = await getDoc(playerRef);
    if (docSnap.exists()) {
      this.newPlayer = docSnap.data() as Player;
      this.newPlayer.id = id;
      this.previewPhoto = this.newPlayer.headshot || null;
      this.previewVideo = this.newPlayer.video || null;
    }
  }

  onFileSelected(event: any, type: 'photo' | 'video') {
    const file = event.target.files[0];
    if (!file) return;

    if (type === 'photo') {
      this.selectedPhoto = file;
      const reader = new FileReader();
      reader.onload = e => this.previewPhoto = e.target?.result as string;
      reader.readAsDataURL(file);
    } else {
      this.selectedVideo = file;
      const reader = new FileReader();
      reader.onload = e => this.previewVideo = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  private async uploadFile(file: File, path: string) {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async createPlayer() {
    try {
      if (this.selectedPhoto) {
        this.newPlayer.headshot = await this.uploadFile(
          this.selectedPhoto,
          `players/photos/${Date.now()}_${this.selectedPhoto.name}`
        );
      }
      if (this.selectedVideo) {
        this.newPlayer.video = await this.uploadFile(
          this.selectedVideo,
          `players/videos/${Date.now()}_${this.selectedVideo.name}`
        );
      }

      const playersRef = collection(this.firestore, 'players');
      const playerToSave = { ...this.newPlayer };
      delete (playerToSave as any).id;

      await addDoc(playersRef, playerToSave);
      alert(`Jugador "${this.newPlayer.name}" agregado correctamente`);
      this.router.navigate(['/players']);
    } catch (err: any) {
      console.error('Error al crear jugador:', err);
      alert('Error al crear jugador: ' + err.message);
    }
  }

  async updatePlayer() {
    try {
      if (this.selectedPhoto) {
        this.newPlayer.headshot = await this.uploadFile(
          this.selectedPhoto,
          `players/photos/${Date.now()}_${this.selectedPhoto.name}`
        );
      }
      if (this.selectedVideo) {
        this.newPlayer.video = await this.uploadFile(
          this.selectedVideo,
          `players/videos/${Date.now()}_${this.selectedVideo.name}`
        );
      }

      const playerRef = doc(this.firestore, `players/${this.newPlayer.id}`);
      const playerToSave = { ...this.newPlayer };
      delete (playerToSave as any).id;

      await updateDoc(playerRef, playerToSave);
      alert(`Jugador "${this.newPlayer.name}" actualizado correctamente`);
      this.router.navigate(['/players']);
    } catch (err: any) {
      console.error('Error al actualizar jugador:', err);
      alert('Error al actualizar jugador: ' + err.message);
    }
  }
}
