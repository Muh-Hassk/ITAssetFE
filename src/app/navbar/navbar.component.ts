import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(private router: Router) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getLinkClass(path: string): string {
    return (this.router.url === '/' && path === '/dashboard') || this.router.url === path ? 'nav-link active' : 'nav-link';
  }
  
}
