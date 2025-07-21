
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
 games = {
  lightsOut: true,
  wordHunt: true,
  chat: false,
  flames: true,
  ticTacToe: true
};

  constructor(private http: HttpClient) {}

  //http://localhost:8080/api/games/config
  //https://nanopg-production.up.railway.app/api/games/config

  ngOnInit(): void {
    this.http.get<any>('https://nanopg-production.up.railway.app/api/games/config')
      .subscribe(config => {
        this.games = config;
      });
  }
}
