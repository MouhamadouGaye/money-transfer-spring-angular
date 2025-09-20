import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  // Form fields
  username = '';
  email = '';
  password = '';
  phoneNumber = '';

  // UI states
  error = '';
  success = '';

  // Dynamic title
  title = 'Create Account';
  isRegister = true; // flag for conditional template rendering

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.success = '';

    if (!this.username || !this.email || !this.password || !this.phoneNumber) {
      this.error = 'All fields are required!';
      return;
    }

    this.authService
      .register(this.username, this.email, this.password, this.phoneNumber)
      .subscribe({
        next: () => {
          this.success = 'Registration successful! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err) => {
          this.error = err.error?.message || 'Registration failed';
        },
      });
  }
}
