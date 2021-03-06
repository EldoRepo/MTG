import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatDialog } from '@angular/material';
import { FirebaseserviceService } from '../services/firebaseservice.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ViewCardComponent } from '../dialogs/view-card/view-card.component';
import { ViewCardsComponent } from '../dialogs/view-cards/view-cards.component';
import { MtgPlayer } from '../interfaces/player';
import { CreateTokenComponent } from '../dialogs/create-token/create-token.component';
import { CardlibraryComponent } from '../cardlibrary/cardlibrary.component';

enum CardLocation {
  Library,
  Creature,
  Enchantment,
  Land,
  Hand,
  Discard,
  Exile,
  CommandZone
}

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css'],
  providers: [FirebaseserviceService],
})
export class ArenaComponent implements OnInit {
  // public cards: any[];
  dynamicCardWidth: string = '110px';
  justTappedTimer = false;
  timer: any;
  public allCards: any[];
  players: any[];
  opponentPlayer: any = {playerId: 'none'};
  currentPlayer: any = {playerId: 'none'};
  gameInstance: any = [];
  eventLogs: any[];
  firstInitialize = true;
  initCount = 0;
  //
  exiledCards: any;
  //
  libraryOne: any; // current player is always using library one
  libraryOneCards: any[]; //
  creaturesOne: any[];
  enchantmentsOne: any[];
  landsOne: any[];
  handOne: any[];
  discardOne: any[];
  commandOne: any[];
  //
  libraryTwo: any; // opponent player is always using library two
  libraryTwoCards: any[];
  creaturesTwo: any[];
  enchantmentsTwo: any[];
  landsTwo: any[];
  handTwo: any[];
  discardTwo: any[];
  commandTwo: any[];

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
  
  drawCardByLibrary(libraryid: string) {
    const libraryCards = this.allCards.filter(x => x.libraryid === libraryid && x.location === CardLocation.Library);
    const cardsDrawn = libraryCards.slice(0, 1);
    cardsDrawn.forEach(x => x.location = 4);
    cardsDrawn.forEach(element => {
      this.fireService.updateCard(element);
    });
  }
  untapLands(libraryid: string) {
    const landCards = this.allCards.filter(x => x.libraryid === libraryid && x.location === CardLocation.Land);
    landCards.forEach(element => {
      element.tapped = 0;
      this.fireService.updateCard(element);
    });
  }
  untapAndDrawCardLocal() {
    // const currentTurnPlayerId = this.gameInstance.turn_possesion;
    // const player = this.players.filter(x => x.playerid === currentTurnPlayerId)[0];
    this.untapAndDrawCard(this.currentPlayer.libraryid);
  }
  untapAndDrawCard(libraryid: string) {
    this.drawCardByLibrary(libraryid);
    this.untapLands(libraryid);
    this.addEvent('Player has drawed card');
  }
  isGameInitialized(): boolean {
    if(!this.gameInstance) return false;
    if(this.gameInstance.turn_possession == "") {
      return false;
    } else {
      return true;
    }
  }
  initializeGame() {
    if (!this.isGameInitialized()) {
      const gameInstance = this.gameInstance;
      gameInstance.turn_possession = this.players[Math.floor(Math.random() * this.players.length)].playerid;
      // if turn possession is an empty string assign a random player.
      this.fireService.updateGameInstanceTurnPossession(gameInstance.turn_possession);
      const selectedPlayer = this.players.filter(x => x.playerid === gameInstance.turn_possession)[0];
      this.untapAndDrawCard(selectedPlayer.libraryid);
      this.shuffleSelectedLibrary(1);
      this.shuffleSelectedLibrary(0);
      this.drawHand(1);
      this.drawHand(0);
    }
  }
  endTurn() {
    const currentTurnPlayerId = this.gameInstance.turn_possesion;
    const currentPlayer = this.players.filter(x => x.playerid === currentTurnPlayerId)[0];
    const newTurnPlayer = this.players.filter(x => x.playerid !== currentTurnPlayerId)[0];
    this.gameInstance.turn_possesion = newTurnPlayer.playerid;
    this.fireService.updateGameInstanceTurnPossession(this.gameInstance.turn_possesion);
    this.untapAndDrawCard(newTurnPlayer.libraryid);
  }
  firstInitSetup() {
    if (this.firstInitialize === true && this.initCount > 3) {
      this.currentPlayer = this.players[0];
      this.opponentPlayer = this.players[1];
      this.setUpCards();
      this.firstInitialize = false;
    }
  }
  createToken() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(CreateTokenComponent, {
      width: '400px',
      data: this.currentPlayer.libraryid
    });
    this.setUpCards();
  }
  changePlayer(selectedPlayerId: string) {
    this.currentPlayer = this.players.filter(x => x.playerid === selectedPlayerId)[0];
    this.opponentPlayer = this.players.filter(x => x.playerid !== selectedPlayerId)[0];
    this.setUpCards();
    this.addEvent('Player has changed players');
  }
  switchLibrary() {
    // this.opponentPlayer = this.players.filter(x => x.playerid === this.currentPlayer.libraryid)[0];
    // this.currentPlayer = this.players.filter(x => x.playerid !== this.currentPlayer.libraryid)[0];
    this.setUpCards();
    this.addEvent('Player has changed players');
  }
  resetGame() {
    this.players.forEach(x=> {
      x.life = 40;
      this.fireService.updatePlayer(x);
    });
    const allCards = this.allCards;
    allCards.forEach(x => {
      x.tapped = 0;
      x.location = 0;
      x.counter = 0;
      // set players life to zero.
      if (x.type === 'token') {
        this.fireService.deleteCard(x);
      } else {
        this.fireService.updateCard(x);
      }
    });
    this.shuffleSelectedLibrary(1);
    this.shuffleSelectedLibrary(0);
    this.fireService.updateGameInstanceTurnPossession("");
  }
  rollDice() {
    this.fireService.rollDice();
  }
  shuffleGraveyardIntoLibrary(cardSet: number) {
    if (cardSet === 1) { // current player.
      const discarded = this.discardOne; // set discarded cards location
      discarded.forEach(x => {
        x.location = CardLocation.Library;
        this.fireService.updateCard(x);
      });
      this.shuffleSelectedLibrary(1);
    }
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
      return CardLocation.Hand;
    }
    if (containerId === 'cdk-drop-list-1') {
      return CardLocation.Land;
    }
    if (containerId === 'cdk-drop-list-2') {
      return CardLocation.Enchantment;
    }
    if (containerId === 'cdk-drop-list-3') {
      return CardLocation.Creature;
    }
    if (containerId === 'cdk-drop-list-4') {
       return CardLocation.Creature;
    }
    if (containerId === 'cdk-drop-list-5') {
       return CardLocation.Enchantment;
    }
    if (containerId === 'cdk-drop-list-6') {
      return CardLocation.Land;
    }
    if (containerId === 'cdk-drop-list-7') {
      return CardLocation.Hand;
    }
    if (containerId === 'cdk-drop-list-8') {
      return CardLocation.Library;
    }
    if (containerId === 'cdk-drop-list-9') {
      return CardLocation.Discard;
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
    if (location === CardLocation.Hand || location === CardLocation.Discard || location === CardLocation.Library) {
      card.tapped = 0;
      card.counter = 0;
      if (card.type.toLowerCase() === 'token') {
        this.fireService.deleteCard(card);
        card = null;
      }
    }
    if (card != null) {
      this.fireService.updateCard(card);
    }
  }
  tapCard(card: any) {
    if (card.tapped === 0) {
      card.tapped = 1;
    } else {
      card.tapped = 0;
    }
    this.fireService.updateCard(card);
    this.dialog.closeAll();
    this.activateJustTappedTimer();
  }
  activateJustTappedTimer() {
    this.justTappedTimer = true;
    setTimeout(() => {
      this.justTappedTimer = false; // Hey I can access 'this' in here!
    }, 3000);
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
  changeCardPosession(card: any) {
    card.libraryid = this.opponentPlayer.libraryid;
    card.location = 1;
    this.fireService.updateCard(card);
  }
  drawHand(libraryNumber: number) {
    let cardLibrary: any[] = [];
    if (libraryNumber === 1) {
      cardLibrary = this.libraryOneCards;
    } else {
      cardLibrary = this.libraryTwoCards;
    }
    const cardsDrawn = cardLibrary.slice(0, 7);
    cardsDrawn.forEach(x => x.location = 4);
    cardsDrawn.forEach(element => {
      this.fireService.updateCard(element);
    });
    this.addEvent('Player has drawed 7 cards');
  }
  hoveringOverCard(card: any) {
    const that = this;
    if (!this.justTappedTimer) {
      this.timer = setTimeout(function() {
        that.viewCard(card);
      }, 2000);
    }
    this.addEvent('Viewed card:' + card.name);
  }
  hoverLeave() {
    clearTimeout(this.timer);
  }
  viewCard(selectedCard: any) {
    this.dialog.closeAll();
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
  getGraveYardImageURL(cardSet: number): string {
    if (cardSet === 1) {
      var topCard = this.discardOne[0];
      if(topCard != null) {
        return topCard.image;
      }
    } else {
      var topCard = this.discardTwo[0];
      if(topCard != null) {
        return topCard.image;
      }
    }
    return 'https://vignette.wikia.nocookie.net/nazizombiesplus/images/d/d5/Graveyard.png/revision/latest?cb=20110810192731';
  }
  viewCards(type: number, cardSet: number) {
    this.dialog.closeAll();
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
    this.exiledCards = this.allCards.filter(x => x.location === CardLocation.Exile);
    //
    this.libraryOneCards = libraryOneSet.filter(x => x.location === CardLocation.Library); // current player is always using library one
    this.creaturesOne = libraryOneSet.filter(x => x.location === CardLocation.Creature);
    this.enchantmentsOne = libraryOneSet.filter(x => x.location === CardLocation.Enchantment);
    this.landsOne = libraryOneSet.filter(x => x.location === CardLocation.Land);
    this.handOne = libraryOneSet.filter(x => x.location === CardLocation.Hand);
    this.discardOne = libraryOneSet.filter(x => x.location === CardLocation.Discard);
    this.commandOne = libraryOneSet.filter(x => x.location === CardLocation.CommandZone);
    //
    this.libraryTwoCards = libraryTwoSet.filter(x => x.location === CardLocation.Library); // opponent player is always using library two
    this.creaturesTwo = libraryTwoSet.filter(x => x.location === CardLocation.Creature);
    this.enchantmentsTwo = libraryTwoSet.filter(x => x.location === CardLocation.Enchantment);
    this.landsTwo = libraryTwoSet.filter(x => x.location === CardLocation.Land);
    this.handTwo = libraryTwoSet.filter(x => x.location === CardLocation.Hand);
    this.discardTwo = libraryTwoSet.filter(x => x.location === CardLocation.Discard);
    this.commandTwo = libraryTwoSet.filter(x => x.location === CardLocation.CommandZone);
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
  getRandomNumber(max:number, min: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  shuffleGivenLibrary(library: any) {
    const libraryCount = library.length;
    // let shuffleCount = 0;
    library.forEach(card => {
      const currentIndex = card.libraryindex;
      const newIndex = this.getRandomNumber(library.length, 1);
      const oldIndex = card.libraryindex;
      let existingCard = library.filter(x => x.libraryindex == newIndex)[0];
      card.libraryindex = newIndex;
      existingCard.libraryindex = oldIndex;
      this.fireService.updateCard(card);
      this.fireService.updateCard(existingCard);
      // shuffleCount++;
    });

    this.reOrderLibrary(library);
    return library;
    // let counter = library.length;
    // // While there are elements in the array
    // while (counter > 0) {
    //     // Pick a random index
    //     const index = Math.floor(Math.random() * counter);
    //     // Decrease counter by 1
    //     counter--;
    //     // And swap the last element with it
    //     const temp = library[counter];
    //     library[counter] = library[index];
    //     library[index] = temp;
    // }
    // return library;
  }
  reOrderLibrary(library: any) {
    library.sort(x=>x.libaryindex);
  }

  shuffleSelectedLibrary(libraryNumber: number) {
    let library: any[];
    if (libraryNumber === 1) {
       library = this.shuffleGivenLibrary(this.libraryOneCards);
    } else {
       library = this.shuffleGivenLibrary(this.libraryTwoCards);
    }
    library.forEach(card =>
    this.fireService.updateCard(card)
    );
    this.addEvent('Player has shuffled library');
  }
  // updateCardCounter(card: any) {
  //   this.fireService.updateCardCounter(card); // increases
  // }
}
