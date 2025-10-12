import { Component, Output, EventEmitter } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Player } from '../detail-component/detail-component';

@Component({
  selector: 'app-players-component',
  standalone:true,
  imports: [CommonModule],
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
    teams: "Chigago Bulls"
  },
  {
    name:'Julian',
    lastName:'Phillips',
    position: 'SF',
    age:21,
    height:'6-8',
    weight:198,
    alias:15,
    teams: "Chigago Bulls"

  },
  {
    name:'Noa',
    lastName:'Essengue',
    position: 'PF',
    age:18,
    height:'6-9',
    weight:194,
    alias:24,
    teams: "Chigago Bulls"
  },
  {
    name:'Jalen',
    lastName:'Smith',
    position: 'F-C',
    age:25,
    height:'6-9',
    weight:215,
    alias:25,
    teams: "Chigago Bulls"
  },
  {
    name:'Tre',
    lastName:'Jones',
    position: 'PG',
    age:18,
    height:'6-1',
    weight:185,
    alias:30,
    teams: "Chigago Bulls"
  },
];


}
