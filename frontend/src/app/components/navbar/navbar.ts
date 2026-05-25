import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  standalone: true
})
export class Navbar {
    @Output() loginClicked = new EventEmitter<void>();
    @Output() logout = new EventEmitter<void>();
    
    @Input() isLoggedIn: boolean = false;
    @Input() userInitial: string = '';
}
