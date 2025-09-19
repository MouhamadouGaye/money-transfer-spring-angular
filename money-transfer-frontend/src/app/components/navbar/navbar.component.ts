import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  username: string | null = null;
  isLoggedIn = false;
  menuOpen = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.getCurrentUser().subscribe((user) => {
      this.isLoggedIn = !!user;
      this.username = user?.username || '';
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.isLoggedIn = true;
        this.username = user.username;
      },
      error: () => {
        this.isLoggedIn = false;
        this.username = null;
      },
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.username = null;
        this.router.navigate(['/login']);
      },
    });
  }
}
