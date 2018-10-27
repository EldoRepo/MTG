import { Component, OnInit } from '@angular/core';
import { MtgCard } from '../interfaces/mtg-card';

@Component({
  selector: 'app-cardlibrary',
  templateUrl: './cardlibrary.component.html',
  styleUrls: ['./cardlibrary.component.css']
})
export class CardlibraryComponent implements OnInit {
  library: MtgCard[];
  constructor() { }

  ngOnInit() {
  }

}
