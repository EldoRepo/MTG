import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseserviceService {
  constructor(private database: AngularFireDatabase) { }
  // updateGameInstance(gameInstance: any): any {
  //   // this.database.object('/Game/').remove();
  //   // this.database.object('/Game/').set(gameInstance);
  //   this.database.object('/Game/').update(gameInstance);
  //   return gameInstance;
  // }
  updateGameInstanceTurnPossession(possession: string): any {
    // this.database.object('/Game/').remove();
    // this.database.object('/Game/').set(gameInstance);
    this.database.object('/Game/turn_possession').set(possession);
    return possession;
  }
  rollDice(): any {
    const value = Math.floor(Math.random() * (20 - 1 + 1) + 1);
    this.database.object('/Game/dice_value').set(value);
    return value;
  }
  deleteCard(card: any): void {
    this.database.object('/Cards/' + card.uid).remove();
  }
  updateCard(card: any): any {
    this.database.object('/Cards/' + card.uid)
    .update(card);
    return card;
  }
  addCard(card: any) {
    card.uid = this.createGuid();
    this.database.object('/Cards/' + card.uid).set(card);
  }
  updateCardCounter(card: any, add: boolean) {
    if (add) {
      card.counter += 1;
    } else {
      card.counter -= 1;
    }
    this.updateCard(card);
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
    this.database.object('/Eventlogs/eventlogs/' + this.createGuid()).set(event);
  }
  createGuid() {
      let text = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  }
}
