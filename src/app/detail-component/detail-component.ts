import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from '../media-component/media-component';
import { Player } from './player.model';


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
