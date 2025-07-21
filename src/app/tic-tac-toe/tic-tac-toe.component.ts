import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tic-tac-toe.component.html',
  styleUrl: './tic-tac-toe.component.scss'
})

export class TicTacToeComponent {
  board: string[] = Array(9).fill('');
  currentPlayer: 'X' | 'O' = 'X';
  winner: string | null = null;

  constructor(private router: Router) {}

  makeMove(index: number): void {
  if (!this.board[index] && !this.winner) {
    this.board[index] = this.currentPlayer;

    if (this.checkWinner()) {
      this.winner = this.currentPlayer;
    } else if (this.isDraw()) {
      this.winner = 'Draw';
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }
}

isDraw(): boolean {
  return this.board.every(cell => cell !== '');
}

  checkWinner(): boolean {
    const patterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    return patterns.some(([a, b, c]) =>
      this.board[a] && this.board[a] === this.board[b] && this.board[b] === this.board[c]
    );
  }

  resetGame(): void {
    this.board = Array(9).fill('');
    this.currentPlayer = 'X';
    this.winner = null;
  }

   goBack() {
    this.router.navigate(['/']);
  }

  share() {
    if (navigator.share) {
      navigator.share({
        title: 'Puzzle Game',
        text: 'Try this Lights Out game!',
        url: window.location.href
      });
    } else {
      alert('Sharing is not supported on this browser.');
    }
  }
}