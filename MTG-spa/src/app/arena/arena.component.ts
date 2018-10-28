import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatDialog } from '@angular/material';
import { FirebaseserviceService } from '../services/firebaseservice.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ViewCardComponent } from '../dialogs/view-card/view-card.component';
import { ViewCardsComponent } from '../dialogs/view-cards/view-cards.component';
import { MtgPlayer } from '../interfaces/player';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css'],
  providers: [FirebaseserviceService]
})
export class ArenaComponent implements OnInit {
  public cards: any[];
  opponentPlayer: MtgPlayer;
  currentPlayer: MtgPlayer;
  gameInstance: any;
  //
  libraryOne: any; // current player is always using library one
  libraryOneCards: any[]; //
  creaturesOne: any[];
  enchantmentsOne: any[];
  landsOne: any[];
  handOne: any[];
  discardOne: any[];
  //
  libraryTwo: any; // opponent player is always using library two
  libraryTwoCards: any[];
  creaturesTwo: any[];
  enchantmentsTwo: any[];
  landsTwo: any[];
  handTwo: any[];
  discardTwo: any[];

  constructor(
      private database: AngularFireDatabase, public dialog: MatDialog,
      public fireService: FirebaseserviceService) {
        database.list('/cards').valueChanges()   // returns observable
        .subscribe(list => {
        this.cards = list;
        console.log(this.cards);
        this.libraryOneCards = this.cards.filter(x => x.location === 0);
        this.creaturesOne = this.libraryOneCards.filter(x => x.location === 1);
        this.enchantmentsOne = this.libraryOneCards.filter(x => x.location === 2);
        this.landsOne = this.libraryOneCards.filter(x => x.location === 3);
        this.handOne = this.libraryOneCards.filter(x => x.location === 4);
        this.discardOne = this.libraryOneCards.filter(x => x.location === 5);
        //
        this.libraryTwoCards = this.cards.filter(x => x.location === 0);
        this.creaturesTwo = this.libraryTwoCards.filter(x => x.location === 1);
        this.enchantmentsTwo = this.libraryTwoCards.filter(x => x.location === 2);
        this.landsTwo = this.libraryTwoCards.filter(x => x.location === 3);
        this.handTwo = this.libraryTwoCards.filter(x => x.location === 4);
        this.discardTwo = this.libraryTwoCards.filter(x => x.location === 5);
        //
     });
     database.list('/Game').valueChanges()   // returns observable
        .subscribe(game => {
        this.gameInstance = game;
     });
  }

  changeLibrary(selectedLibraryId: string) {
    const selectedLibrary = this.gameInstance.libraries.filter(x => x.libraryId === selectedLibraryId);
    const otherLibrary = this.gameInstance.libraries.filter(x => x.libraryId !== selectedLibraryId);
    this.libraryOne = this.cards.filter(x => x.location === 0 && x.libraryId === selectedLibraryId);
    this.libraryTwo = this.cards.filter(x => x.location === 0 && x.libraryId !== selectedLibraryId);
    this.currentPlayer.currentLife = this.gameInstance.p1_life;
    this.opponentPlayer.currentLife = this.gameInstance.p2_life;
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    const movedCard = event.previousContainer.data[event.previousIndex];
    console.log(movedCard);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    this.moveCard(movedCard, this.getLocationId(event.container.id));  // move card
  }
  getLocationId(containerId: string) {
    if (containerId === 'cdk-drop-list-0') {
      return 1;
    }
    if (containerId === 'cdk-drop-list-1') {
      return 2;
    }
    if (containerId === 'cdk-drop-list-2') {
      return 3;
    }
    if (containerId === 'cdk-drop-list-3') {
      return 4;
    }
    if (containerId === 'cdk-drop-list-4') {
      return 5;
    }
  }
  isScroll(zoneNumber: number) {
    if (undefined !== this.landsTwo && this.landsTwo.length) {
      return this.landsTwo.length;
    } else {
      return 0;
    }
  }
  // getCount(cards: any[]) {

  // }
  deleteCard(card: any) {
    this.fireService.deleteCard(card);
    console.log('deleted');
  }
  moveCard(card: any, location: number) {
    card.location = location;
    this.fireService.updateCard(card);
  }
  tapCard(card: any) {
    if (card.tapped === 0) {
      card.tapped = 1;
    } else {
      card.tapped = 0;
    }
    this.fireService.updateCard(card);
  }
  ngOnInit() {
  }
  shuffle() {
  }
  startGame() {
  }
  drawCard() {
    const cardsDrawn = this.libraryOneCards.slice(0, 1);
    cardsDrawn.forEach(x => x.location = 4);
    cardsDrawn.forEach(element => {
      this.fireService.updateCard(element);
    });
  }
  changeCardPosession() {
    //
  }
  drawHand() {
    const cardsDrawn = this.cards.slice(0, 7);
    cardsDrawn.forEach(x => x.location = 4);
    cardsDrawn.forEach(element => {
      this.fireService.updateCard(element);
    });
  }
  viewCard(selectedCard: any) {
    const dialogRef = this.dialog.open(ViewCardComponent, {
      width: '400px',
      data: selectedCard
    });
  }
  viewCards(cardSet: number) {
    let cards: any[];
    if (cardSet === 1) {
      cards = this.libraryOne;
    } else {
      cards = this.libraryTwo;
    }
    const dialogRef = this.dialog.open(ViewCardsComponent, {
      width: '300px',
      data: cards
    });
  }
}
