import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatDialog } from '@angular/material';
import { FirebaseserviceService } from '../services/firebaseservice.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css'],
  providers: [FirebaseserviceService]
})
export class ArenaComponent implements OnInit {
  public cards: any[];
  libraryOne: any[];
  creaturesOne: any[];
  enchantmentsOne: any[];
  landsOne: any[];
  handOne: any[];
  //
  libraryTwo: any[];
  creaturesTwo: any[];
  enchantmentsTwo: any[];
  landsTwo: any[];
  handTwo: any[];



  constructor(
      private database: AngularFireDatabase, public dialog: MatDialog,
      public fireService: FirebaseserviceService) {
        database.list('/cards').valueChanges()   // returns observable
        .subscribe(list => {
        this.cards = list;
        console.log(this.cards);
        this.libraryOne = this.cards.filter(x => x.location === 0);
        this.creaturesOne = this.cards.filter(x => x.location === 1);
        this.enchantmentsOne = this.cards.filter(x => x.location === 2);
        this.landsOne = this.cards.filter(x => x.location === 3);
        this.handOne = this.cards.filter(x => x.location === 4);
        //
        this.libraryTwo = this.cards.filter(x => x.location === 0);
        this.creaturesTwo = this.cards.filter(x => x.location === 1);
        this.enchantmentsTwo = this.cards.filter(x => x.location === 2);
        this.landsTwo = this.cards.filter(x => x.location === 3);
        this.handTwo = this.cards.filter(x => x.location === 4);
        this.drawCards();
     });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  deleteCard(card: any) {
    this.fireService.deleteCard(card);
    console.log('deleted');
  }
  moveCard(card: any, location: number) {
    card.location = location;
    this.fireService.updateCard(card);
  }
  tapCard(card: any) {
    card.tapped = 1;
    this.fireService.updateCard(card);
  }
  ngOnInit() {
  }
  shuffle() {
  }
  startGame() {
  }
  drawCards() {
    const cardsDrawn = this.cards.slice(0, 7);
    cardsDrawn.forEach(x => x.location = 4);
    cardsDrawn.forEach(element => {
      this.fireService.updateCard(element);
    });
  }
}
