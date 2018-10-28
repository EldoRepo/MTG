import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MtgCard } from '../interfaces/mtg-card';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { ViewCardComponent } from '../dialogs/view-card/view-card.component';
import { MatDialog } from '@angular/material';

class MtgCardFire {
  constructor(public CardName) { }
}

@Component({
  selector: 'app-cardlibrary',
  templateUrl: './cardlibrary.component.html',
  styleUrls: ['./cardlibrary.component.css'],
})

export class CardlibraryComponent implements OnInit {
  public selectedLibrary: any;
  public cards: any[];
  constructor(
      private database: AngularFireDatabase, public dialog: MatDialog) {
        database.list('/cards').valueChanges()   // returns observable
        .subscribe(list => {
        this.cards = list;
        console.log(this.cards);
     });
  }
  ngOnInit() {
  }
  viewCard(selectedCard: any) {
    const dialogRef = this.dialog.open(ViewCardComponent, {
      width: '400px',
      data: selectedCard
    });
    this.changeState(this.cards);
  }
  public changeState(card: any): void {
    this.cards.push(this.cards);
  }
}
