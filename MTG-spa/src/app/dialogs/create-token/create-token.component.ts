import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FirebaseserviceService } from '../../services/firebaseservice.service';

@Component({
  selector: 'app-create-token',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.css'],
  providers: [FirebaseserviceService]
})
export class CreateTokenComponent implements OnInit {
  name;
  power;
  toughness;
  quantity;
  constructor(@Inject(MAT_DIALOG_DATA) public libraryid: string, public dialog: MatDialog, public fireService: FirebaseserviceService) { }

  ngOnInit() {
  }
  onClose(): void {
    this.dialog.closeAll();
  }
  createToken() {
    const card: any = {
      name: this.name,
      tapped: false,
      type: 'Token',
      toughness: this.toughness,
      power: this.power,
      libraryid: this.libraryid,
      image: 'https://mtgcardsmith.com/view/complete/full/2018/9/23/1537713309526077.png',
      location: 1,
      counter: 0
    };
    for (let x = 0; x < this.quantity; x++) {
      this.fireService.addCard(card);
    }
  }
}
