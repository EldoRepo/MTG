import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseserviceService {
  constructor(private database: AngularFireDatabase) { }

  deleteCard(card: any): void {
    this.database.object('/Cards/' + card.uid).remove();
  }
  updateCard(card: any): any {
    this.database.object('/Cards/' + card.uid)
    .update(card);
    return card;
  }
  updatePlayer(player: any): any {
    this.database.object('/players/' + player.playerid)
    .update(player);
    return player;
  }
  getEventLogs() {
    // let events: any[] = [{}];
    return this.database.list('/Eventlogs/eventLogs').valueChanges();
  }
  getAllCards() {
    return this.database.list('/Cards').valueChanges();
  }
  addEvent(event: string) {
     // this.database.object('/Eventlogs/eventLogs/' + this.createGuid()).set(event);
  }
  createGuid() {
      // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      //     // tslint:disable-next-line:no-bitwise
      //     const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      //     return v.toString(16);
      // });
      return 'hello';
  }
}
