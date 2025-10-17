import { Component, Output, EventEmitter } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Player, DetailComponent } from '../detail-component/detail-component';

@Component({
  selector: 'app-players-component',
  standalone:true,
  imports: [CommonModule, DetailComponent],
  templateUrl: './players-component.html',
  styleUrl: './players-component.css'
})
export class PlayersComponent {
  
  teams: Player[] = [{
    name:'Dalen',
    lastName:'Terry',
    position: 'SG',
    age:23,
    height:'6-7',
    weight:195,
    alias: 7,
    teams: "Chicago Bulls",
    headshot: "/HEADSHOTS/Terry_Dalen.png",
    initials:"CHI"
  },
  {
    name:'Julian',
    lastName:'Phillips',
    position: 'SF',
    age:21,
    height:'6-8',
    weight:198,
    alias:15,
    teams: "Chicago Bulls",
    headshot: "/HEADSHOTS/Phillips_Julian.png",
    initials:"CHI"
  },
  {
    name:'Noa',
    lastName:'Essengue',
    position: 'PF',
    age:18,
    height:'6-9',
    weight:194,
    alias:24,
    teams: "Chicago Bulls",
    headshot: "/HEADSHOTS/Essengue_Noa.png",
    initials:"CHI"
  },
  {
    name:'Jalen',
    lastName:'Smith',
    position: 'F-C',
    age:25,
    height:'6-9',
    weight:215,
    alias:25,
    teams: "Chicago Bulls",
    headshot: "/HEADSHOTS/Smith_Jalen.png",
    initials:"CHI"
  },
  {
    name:'Tre',
    lastName:'Jones',
    position: 'PG',
    age:18,
    height:'6-1',
    weight:185,
    alias:30,
    teams: "Chigago Bulls",
    headshot: "/HEADSHOTS/Jones_Tre.png",
    initials:"CHI"
  },
];
selectedPlayer: any;

}