import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
  providers: [FirebaseserviceService],
})
export class ArenaComponent implements OnInit {
  // public cards: any[];
  timer: any;
  public allCards: any[];
  players: any[];
  opponentPlayer: any = {playerId: 'none'};
  currentPlayer: any = {playerId: 'none'};
  gameInstance: any;
  eventLogs: any[];
  firstInitialize = true;
  initCount = 0;
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
    database.list('/Eventlogs/eventlogs').valueChanges()   // returns observable
      .subscribe(eventlogs => {
      this.eventLogs = eventlogs;
      console.log(this.eventLogs);
      if (this.firstInitialize === true) {
        this.initCount++;
        this.firstInitSetup();
      }
    });
    database.list('/Cards').valueChanges()
    .subscribe(list => {
      this.allCards = list;
      this.allCards = this.allCards.sort((a, b) => a.libraryindex < b.libraryindex ? -1 : a.libraryindex > b.libraryindex ? 1 : 0);
      if (this.firstInitialize === true) {
        this.initCount++;
        this.firstInitSetup();
      } else {
         this.setUpCards();
      }
    });
    database.list('/players').valueChanges()   // returns observable
      .subscribe(players => {
      this.players = players;
      console.log(this.players);
      if (this.firstInitialize === true) {
        this.currentPlayer = this.players[0];
        this.opponentPlayer = this.players[1];
        this.initCount++;
        this.firstInitSetup();
      } else {
        this.currentPlayer = this.players.filter(x => x.playerid === this.currentPlayer.playerid)[0];
        this.opponentPlayer = this.players.filter(x => x.playerid !== this.currentPlayer.playerid)[0];
      }
    });
    database.list('/Game').valueChanges()   // returns observable
        .subscribe(game => {
        this.gameInstance = game;
        console.log(this.gameInstance);
        if (this.firstInitialize === true) {
          this.initCount++;
          this.firstInitSetup();
        }
     });
  }
  firstInitSetup() {
    if (this.firstInitialize === true && this.initCount > 3) {
      this.currentPlayer = this.players[0];
      this.opponentPlayer = this.players[1];
      this.setUpCards();
      this.firstInitialize = false;
    }
  }
  changePlayer(selectedPlayerId: string) {
    this.currentPlayer = this.players.filter(x => x.playerid === selectedPlayerId)[0];
    this.opponentPlayer = this.players.filter(x => x.playerid !== selectedPlayerId)[0];
    this.setUpCards();
    this.addEvent('Player has changed players');
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
    this.addEvent('Player has moved a card');
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
      return 1;
    }
    if (containerId === 'cdk-drop-list-5') {
      return 2;
    }
    if (containerId === 'cdk-drop-list-6') {
      return 3;
    }
    if (containerId === 'cdk-drop-list-7') {
      return 4;
    }
    if (containerId === 'cdk-drop-list-8') {
      return 0;
    }
    if (containerId === 'cdk-drop-list-9') {
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
    const cardLibrary: any[] = this.libraryOneCards;
    const cardsDrawn = cardLibrary.slice(0, 1);
    cardsDrawn.forEach(x => x.location = 4);
    cardsDrawn.forEach(element => {
      this.fireService.updateCard(element);
    });
    this.addEvent('Player has drawed card');
  }
  changeCardPosession() {
    //
  }
  drawHand() {
    const cardLibrary: any[] = this.libraryOneCards;
    const cardsDrawn = cardLibrary.slice(0, 7);
    cardsDrawn.forEach(x => x.location = 4);
    cardsDrawn.forEach(element => {
      this.fireService.updateCard(element);
    });
    this.addEvent('Player has drawed 7 cards');
  }
  hoveringOverCard(card: any) {
    const that = this;
    this.timer = setTimeout(function() {
      that.viewCard(card);
    }, 2000);
    this.addEvent('Viewed card:' + card.name);
  }
  hoverLeave() {
    clearTimeout(this.timer);
  }
  viewCard(selectedCard: any) {
    const dialogRef = this.dialog.open(ViewCardComponent, {
      width: '400px',
      data: selectedCard
    });
    this.setUpCards();
  }
  addEvent(event: string) {
    console.log(event);
    this.fireService.addEvent(event);
  }
  viewCards(type: number, cardSet: number) {
    let cards: any[];
    if (cardSet === 1) {
      if (type === 0) {
        cards = this.libraryOneCards;
      } else {
        cards = this.discardOne;
      }
    } else {
      if (type === 0) {
        cards = this.libraryTwoCards;
      } else {
        cards = this.discardTwo;
      }
    }
    const dialogRef = this.dialog.open(ViewCardsComponent, {
      width: '500px',
      data: cards
    });
    this.addEvent('Player has viewed library or discard');
  }
  setUpCards() {
    const currentPlayerSet: MtgPlayer = this.players.filter(x => x.playerid === this.currentPlayer.playerid)[0];
    const opponentPlayerSet: MtgPlayer = this.players.filter(x => x.playerid !== this.currentPlayer.playerid)[0];
    const libraryOneSet = this.allCards.filter(x => x.libraryid === currentPlayerSet.libraryid);
    const libraryTwoSet = this.allCards.filter(x => x.libraryid === opponentPlayerSet.libraryid);
    //
    console.log('here are cards');
    this.libraryOneCards = libraryOneSet.filter(x => x.location === 0); // current player is always using library one
    this.creaturesOne = libraryOneSet.filter(x => x.location === 1);
    this.enchantmentsOne = libraryOneSet.filter(x => x.location === 2);
    this.landsOne = libraryOneSet.filter(x => x.location === 3);
    this.handOne = libraryOneSet.filter(x => x.location === 4);
    this.discardOne = libraryOneSet.filter(x => x.location === 5);
    //
    this.libraryTwoCards = libraryTwoSet.filter(x => x.location === 0); // opponent player is always using library two
    this.creaturesTwo = libraryTwoSet.filter(x => x.location === 1);
    this.enchantmentsTwo = libraryTwoSet.filter(x => x.location === 2);
    this.landsTwo = libraryTwoSet.filter(x => x.location === 3);
    this.handTwo = libraryTwoSet.filter(x => x.location === 4);
    this.discardTwo = libraryTwoSet.filter(x => x.location === 5);
    //
    console.log(this.handOne);
    console.log(this.libraryOneCards);
    console.log(this.libraryTwoCards);
  }
  increaseLife(player: number) {
    let selectedPlayer: any = {};
    if (player === 1) { // current player
      selectedPlayer = this.players.filter(x => x.playerid === this.currentPlayer.playerid)[0];
    } else {
      selectedPlayer = this.players.filter(x => x.playerid !== this.currentPlayer.playerid)[0];
    }
    selectedPlayer.life += 1;
    this.fireService.updatePlayer(selectedPlayer);
    this.addEvent('Player has increased life');
  }
  decreaseLife(player: number) {
    console.log(player);
    let selectedPlayer: any = {};
    if (player === 1) { // current player
      selectedPlayer = this.players.filter(x => x.playerid === this.currentPlayer.playerid)[0];
    } else {
      selectedPlayer = this.players.filter(x => x.playerid !== this.currentPlayer.playerid)[0];
    }
    selectedPlayer.life -= 1;
    this.fireService.updatePlayer(selectedPlayer);
    this.addEvent('Player has decreased life');
  }
  getShuffleLibrary(library: any) {
    const libraryCount = library.length;
    let counter = library.length;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        const index = Math.floor(Math.random() * counter);
        // Decrease counter by 1
        counter--;
        // And swap the last element with it
        const temp = library[counter];
        library[counter] = library[index];
        library[index] = temp;
    }
    return library;
  }
  shuffleLibrary(libraryNumber: number) {
    let library: any[];
    if (libraryNumber === 1) {
       library = this.getShuffleLibrary(this.libraryOneCards);
    } else {
       library = this.getShuffleLibrary(this.libraryTwoCards);
    }
    library.forEach(x =>
    this.fireService.updateCard(x)
    );
    this.addEvent('Player has shuffled library');
  }
}
