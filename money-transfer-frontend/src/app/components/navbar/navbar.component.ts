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

  constructor(private authService: AuthService) {
    // this.authService.getCurrentUser().subscribe((user) => {
    //   this.isLoggedIn = !!user;
    //   this.username = user?.username || '';
    // });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.username = user?.username || null;
    });
  }

  ngOnInit1() {
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // logout() {
  //   this.authService.logout().subscribe({
  //     next: () => {
  //       this.isLoggedIn = false;
  //       this.username = null;
  //       this.router.navigate(['/login']);
  //     },
  //   });
  // }

  logout() {
    this.authService.logout().subscribe();
  }
}
