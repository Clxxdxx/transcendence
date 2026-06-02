import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  standalone: true
})
export class Footer {
  @Output() termsClicked = new EventEmitter<void>();

}
