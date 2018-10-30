import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FirebaseserviceService } from '../../services/firebaseservice.service';

@Component({
  selector: 'app-view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.css'],
  providers: [FirebaseserviceService]
})
export class ViewCardComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public card: any, public firebaseService: FirebaseserviceService, public dialog: MatDialog) { }

  ngOnInit() {
  }
  onClose(): void {
    this.dialog.closeAll();
  }
  addCounter() {
    this.firebaseService.updateCardCounter(this.card, true);
  }
  subtractCounter() {
    this.firebaseService.updateCardCounter(this.card, false);
  }
}
