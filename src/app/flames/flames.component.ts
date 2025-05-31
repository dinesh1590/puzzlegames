import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-flames',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './flames.component.html',
  styleUrl: './flames.component.scss'
})
export class FlamesComponent {
name1: string = '';
  name2: string = '';
  result: string = '';
  flamesHistory: { name1: string, name2: string, result: string }[] = [];

  calculateFLAMES(): void {
    const cleanName1 = this.name1.toLowerCase().replace(/\s/g, '');
    const cleanName2 = this.name2.toLowerCase().replace(/\s/g, '');

    let a = cleanName1.split('');
    let b = cleanName2.split('');

    for (let i = 0; i < a.length; i++) {
      const index = b.indexOf(a[i]);
      if (index !== -1) {
        a[i] = '';
        b[index] = '';
      }
    }

    const count = (a.join('') + b.join('')).length;
    const flames = ["Friends", "Love", "Affection", "Marriage", "Enemy", "Siblings"];
    let temp = [...flames];
    let index = 0;

    while (temp.length > 1) {
      index = (index + count - 1) % temp.length;
      temp.splice(index, 1);
    }

    this.result = temp[0];
    this.flamesHistory.push({ name1: this.name1, name2: this.name2, result: this.result });
  }
}