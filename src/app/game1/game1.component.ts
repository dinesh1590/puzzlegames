import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-game1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game1.component.html',
  styleUrl: './game1.component.scss'
})
export class Game1Component implements OnInit {
  grid: boolean[][] = [];
  isWin: boolean = false;
  showHelp = false;

  gridSize: number = 5;
  gridSizes: number[] = [3, 4, 5];

  clearWinTimeout: any = null;

  ngOnInit() {
    this.resetGame();
  }
  
    constructor(private router: Router) {}

  initializeGrid() {
    this.isWin = false;
    this.grid = Array.from({ length: this.gridSize }, () =>
      Array.from({ length: this.gridSize }, () => Math.random() > 0.5)
    );
  }

  resetGame() {
    this.initializeGrid();
  }

  toggleLight(i: number, j: number): void {
    const dirs = [
      [0, 0],     // the clicked light
      [-1, 0],    // top
      [1, 0],     // bottom
      [0, -1],    // left
      [0, 1]      // right
    ];

    for (let [dx, dy] of dirs) {
      const x = i + dx;
      const y = j + dy;

      if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
        this.grid[x][y] = !this.grid[x][y];
      }
    }

    this.checkWin();
  }

  checkWin(): void {
    this.isWin = this.grid.flat().every(cell => !cell);

    

    if (this.isWin) {

    this.launchConfetti();

    if (this.clearWinTimeout) {
      clearTimeout(this.clearWinTimeout);
    }
    this.clearWinTimeout = setTimeout(() => {
      this.isWin = false;
      this.clearWinTimeout = null;
    }, 3000); // message disappears after 3 seconds
  }
  }

  onGridSizeChange(): void {
    this.resetGame();
  }

  launchConfetti() {
  const duration = 4 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 80,
      spread: 150,
      origin: { x: 0},
    });
    confetti({
      particleCount: 8,
      angle: 90,
      spread: 55,
      origin: { y: 0.6 },
    });
    confetti({
      particleCount: 5,
      angle: 100,
      spread: 150,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
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