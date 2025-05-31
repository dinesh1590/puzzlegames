import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-whack-a-mole',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whack-a-mole.component.html',
  styleUrl: './whack-a-mole.component.scss'
})
export class WhackAMoleComponent {
 gridSize = 9;
  moleIndex: number = -1;
  score: number = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startGame();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startGame(): void {
    this.intervalId = setInterval(() => {
      this.moleIndex = Math.floor(Math.random() * this.gridSize);
    }, 1000);
  }

  whack(index: number): void {
    if (index === this.moleIndex) {
      this.score++;
      this.moleIndex = -1;
    }
  }
}