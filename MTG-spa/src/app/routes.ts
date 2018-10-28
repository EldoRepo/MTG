import { Routes } from '@angular/router';
import { CardlibraryComponent } from './cardlibrary/cardlibrary.component';
import { ArenaComponent } from './arena/arena.component';

export const appRoutes: Routes = [
    {
      path: 'arena',
      component: ArenaComponent
    },
    {
      path: 'library',
      component: CardlibraryComponent
    },
    { path: '', component: ArenaComponent },
  ];
