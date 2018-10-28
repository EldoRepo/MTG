import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ArenaComponent } from './arena/arena.component';
import { CardlibraryComponent } from './cardlibrary/cardlibrary.component';
import { ViewCardComponent } from './dialogs/view-card/view-card.component';
import { CustomMaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { firebaseConfig } from './firebase.config';
import { MatDialog, MatDialogRef } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    ArenaComponent,
    CardlibraryComponent,
    ViewCardComponent
  ],
  entryComponents: [
    ViewCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    AngularFireModule.initializeApp(firebaseConfig, 'MTGgame'),
    AngularFireDatabaseModule
  ],
  providers: [
    {provide: MatDialogRef, useValue: {}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
