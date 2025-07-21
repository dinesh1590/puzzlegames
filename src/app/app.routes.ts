import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { Game1Component } from './game1/game1.component';
import { WhackAMoleComponent } from './whack-a-mole/whack-a-mole.component';
import { FlamesComponent } from './flames/flames.component';
import { ChatComponent } from './chat/chat.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';

export const routes: Routes =[
   {path: '', component: HomeComponent },
   {path:'chat',component: ChatComponent },
  { path: 'lights-out', component:  Game1Component},
  { path: 'word-hunt', component:  GameComponent},
  { path: 'whack-a-mole', component:  WhackAMoleComponent},
  { path: 'flames', component:  FlamesComponent},
  { path: 'tic-tac-toe', component: TicTacToeComponent },
  { path: '**', redirectTo: '' }
];