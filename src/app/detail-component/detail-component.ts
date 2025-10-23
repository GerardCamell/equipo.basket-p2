import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from '../media-component/media-component';

export interface Player {
  name: string;
  lastName: string;
  position: string;
  age: number;
  height: string;
  weight: number;
  alias: number;
  teams: string;
  headshot: string;
  initials: string;
  video: string;
}

@Component({
  selector: 'app-detail-component',
  standalone: true,
  imports: [CommonModule, MediaComponent], 
  templateUrl: './detail-component.html',
  styleUrls: ['./detail-component.css'] 
})
export class DetailComponent {
  @Input() player: Player | null = null;
}
