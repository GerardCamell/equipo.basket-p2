import { Component,Input } from '@angular/core';
import {CommonModule} from '@angular/common';
export interface Player{
  name:string;
  lastName:string;
  position:string;
  age:number;
  height:string;
  weight:number;
  alias:number;
  teams:string;
  headshot: string;
  initials:string;
}

@Component({
  selector: 'app-detail-component',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './detail-component.html',
  styleUrl: './detail-component.css'
})
export class DetailComponent {
 @Input() player: Player | null = null;
 

}