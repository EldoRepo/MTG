import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.css']
})
export class ViewCardComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public card: any, public dialog: MatDialog) { }

  ngOnInit() {
  }
  onClose(): void {
    this.dialog.closeAll();
  }
}
