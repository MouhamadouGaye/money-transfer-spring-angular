import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  // form fields
  email = '';
  password = '';
  username = '';

  // UI states
  error = '';
  success = '';

  // Dynamic title for consistency with Register
  title = 'Welcome Back';
  isRegister = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.success = '';

    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    // this.authService.login(this.email, this.password).subscribe({
    //   next: () => {
    //     // this.success = 'Login successful! Redirecting...';
    //     // setTimeout(() => this.router.navigate(['/dashboard']), 500);

    //     // Immediately fetch user so AuthGuard is satisfied
    //     this.authService.getCurrentUser().subscribe({
    //       next: (user) => {
    //         this.success = 'Login successful! Redirecting...';
    //         setTimeout(() => this.router.navigate(['/dashboard']), 300);
    //       },
    //       error: () => {
    //         this.error = 'Could not fetch user after login';
    //       },
    //     });
    //   },
    //   error: (err) => {
    //     this.error = err.error?.message || 'Login failed';
    //   },
    // });
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.success = 'Login successful! Redirecting...';
        setTimeout(() => this.router.navigate(['/dashboard']), 500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
      },
    });
  }
}
