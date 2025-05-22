import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { Game1Component } from './game1/game1.component';

export const routes: Routes =[
   {path: '', component: HomeComponent },
  { path: 'lights-out', component:  Game1Component},
  { path: 'word-hunt', component:  GameComponent},
  { path: '**', redirectTo: '' }
];