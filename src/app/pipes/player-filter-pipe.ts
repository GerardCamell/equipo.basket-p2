import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../detail-component/detail-component';

@Pipe({
  name: 'playerFilter',
  standalone:true
})
export class PlayerFilterPipe implements PipeTransform {

  transform(players: Player[], searchText: string, filterBy: string): Player[] {
    if (!players || !searchText) {
      return players;
    }

    searchText = searchText.toLowerCase();

    switch (filterBy) {
      case 'nombre':
        return players.filter(player =>
          player.name.toLowerCase().includes(searchText)
        );
      case 'posicion':
        return players.filter(player =>
          player.position.toLowerCase().includes(searchText)
        );
      case 'edad':
        return players.filter(player =>
          player.age.toString().includes(searchText)
        );
      default:
        return players;
    }
  }
}
