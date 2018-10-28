import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseserviceService {
  constructor(private database: AngularFireDatabase) { }

  deleteCard(card: any): void {
    this.database.object('/cards/' + card.uid).remove();
  }
  updateCard(card: any): any {
    this.database.object('/cards/' + card.uid)
    .update(card);
    return card;
  }
  // getLibrary(libraryId: string) {
  //   let library: any[] = [{}];
  //   this.database.list('/cards').valueChanges().subscribe(cards => {
  //     library = cards.filter(x => x.libraryId === libraryId);
  //   });
  //   return library;
  // }
  getAllCards() {
    return this.database.list('/cards').valueChanges();
  }
}
