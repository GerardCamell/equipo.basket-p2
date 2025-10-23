import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-media-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-component.html',
  styleUrls: ['./media-component.css']
})
export class MediaComponent {
  @Input() videoUrl: string = '';
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  play() {
    this.videoPlayer.nativeElement.play();
  }

  pause() {
    this.videoPlayer.nativeElement.pause();
  }

  stop() {
    const video = this.videoPlayer.nativeElement;
    video.pause();
    video.currentTime = 0;
  }
}