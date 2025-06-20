
import { Component } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import confetti from 'canvas-confetti';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  lengths = [4, 5, 6];
  chances = [6, 8, 10, 12, 14, 16];
  selectedLength = 4;
  selectedChances = 8;
  wordList: { [key: string]: string[] } = {};

  guess = '';
  correctWord = '';
  attempts: { word: string, results: string[] }[] = [];
  maxAttempts = 8;
  message = '';
  gameOver = false;
  gameStarted = false;
  showHelp = false;

  finalmsg ='';


  constructor(private http: HttpClient, private router: Router) {}

  @ViewChild('guessInput') guessInputRef!: ElementRef<HTMLInputElement>;


  ngOnInit() {
    this.loadWords();
  }

  loadWords() {
    this.http.get<{ [key: string]: string[] }>('/assets/words.json').subscribe(
      (data) => {
        this.wordList = data;
      },
      (error) => {
        console.error('Error loading words JSON:', error);
      }
    );
  }

  startGame() {
    this.maxAttempts = this.selectedChances;
    this.correctWord = this.generateRandomWord(this.selectedLength);
    this.attempts = [];
    this.message = '';
    this.gameOver = false;
    this.gameStarted = true;
    this.guess = '';

    setTimeout(() => {
    this.guessInputRef.nativeElement.focus();
    }, 100);
  }

  generateRandomWord(length: number): string {
    const possibleWords = this.wordList[length.toString()] || ['ERROR'];
    const index = Math.floor(Math.random() * possibleWords.length);
    return possibleWords[index].toUpperCase();
  }

  submitGuess() {
    const userGuess = this.guess.toUpperCase();

    if (userGuess.length !== this.correctWord.length) {
      this.message = `Please enter a ${this.correctWord.length}-letter word.`;
      return;
    }

    const resultIcons = this.getResultIcons(userGuess);
    this.attempts.push({ word: userGuess, results: resultIcons });

    if (resultIcons.every(r => r === '✅')) {
      this.showFinalMsg('🎉 Boom! You cracked the code!');
       this.launchConfetti();
      this.gameOver = true;
    } else if (this.attempts.length >= this.maxAttempts) {
      this.showFinalMsg(`❌ Game Over. The word was ${this.correctWord}.`);
      this.gameOver = true;
    } else {
      this.message = '';
    }

    this.guess = '';
    setTimeout(() => {
    this.guessInputRef.nativeElement.focus();
  }, 100);
  }

  getResultIcons(guess: string): string[] {
    const result: string[] = Array(guess.length).fill('🚫');
    const used: boolean[] = Array(guess.length).fill(false);
    const correct = this.correctWord.split('');

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === correct[i]) {
        result[i] = '✅';
        used[i] = true;
        correct[i] = '';
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (result[i] === '✅') continue;
      const idx = correct.findIndex((ch, j) => ch === guess[i] && !used[j]);
      if (idx !== -1) {
        result[i] = '⭐';
        correct[idx] = '';
        used[idx] = true;
      }
    }

    return result;
  }

  isDarkMode = false;

toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;
  document.body.classList.toggle('dark-mode', this.isDarkMode);
}


private clearMsgTimeout: any = null;

 showFinalMsg(msg: string) {
    this.finalmsg = msg;

    if (this.clearMsgTimeout) {
      clearTimeout(this.clearMsgTimeout);
    }

    

    this.clearMsgTimeout = setTimeout(() => {
      this.finalmsg = '';  // triggers *ngIf to remove element from DOM
      this.clearMsgTimeout = null;
    }, 3000);
  }

  startover() {
  window.location.reload();
 }

 allowOnlyLetters(event: KeyboardEvent) {
  const char = String.fromCharCode(event.keyCode || event.which);
  const pattern = /^[a-zA-Z]+$/;

  if (!pattern.test(char)) {
    event.preventDefault();
  }
}

launchConfetti() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 8,
      angle: 80,
      spread: 100,
      origin: { x: 0},
    });
   
    confetti({
      particleCount: 8,
      angle: 100,
      spread: 100,
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