import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FirebaseserviceService } from '../../services/firebaseservice.service';

@Component({
  selector: 'app-view-cards',
  templateUrl: './view-cards.component.html',
  styleUrls: ['./view-cards.component.css'],
  providers: [FirebaseserviceService]
})
export class ViewCardsComponent implements OnInit {
  company = 0;
  selectValue = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public cards: any[], public fireService: FirebaseserviceService, public dialog: MatDialog) { }

  ngOnInit() {
  }
  onClose(): void {
    this.dialog.closeAll();
  }
  moveCard(card: any) {
    if (this.company !== 0) {
      card.location = this.company;
      this.fireService.updateCard(card);
    } else {
      alert('please choose a selection');
    }
  }
}
