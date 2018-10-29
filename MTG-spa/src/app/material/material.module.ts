import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatDialogModule,
  MatGridListModule,
  MatSelectModule,
  MatListModule,
  MatBadgeModule,
  MatInputModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatDialogModule,
    ScrollingModule,
    ScrollDispatchModule,
    DragDropModule,
    MatSelectModule,
    MatListModule,
    MatBadgeModule,
    MatInputModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatDialogModule,
    ScrollingModule,
    ScrollDispatchModule,
    DragDropModule,
    MatSelectModule,
    MatListModule,
    MatBadgeModule,
    MatInputModule
  ]
})
export class CustomMaterialModule {}
