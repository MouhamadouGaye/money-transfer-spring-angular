// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   imports: [],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.scss'
// })
// export class DashboardComponent {

// }
import { Component, OnInit } from '@angular/core';
import { TransferService } from '../../services/transfer.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  balance: number = 0;
  recentTransfers: any[] = [];
  toUserId: number | null = null;
  amount: number | null = null;
  error: string = '';
  success: string = '';

  constructor(
    private transferService: TransferService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.balance = user.balance;
        this.loadTransfers(user.id);
      },
    });
  }

  loadTransfers(userId: number) {
    this.transferService.getTransfers(userId).subscribe({
      next: (transfers) => {
        this.recentTransfers = transfers.slice(-5).reverse(); // latest 5
      },
    });
  }

  sendTransfer() {
    if (!this.toUserId || !this.amount) return;
    this.error = '';
    this.success = '';
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.transferService
          .createTransfer(user.id, this.toUserId!, this.amount!)
          .subscribe({
            next: () => {
              this.success = 'Transfer successful!';
              this.loadUserData();
              this.toUserId = null;
              this.amount = null;
            },
            error: (err) =>
              (this.error = err.error?.message || 'Transfer failed'),
          });
      },
    });
  }
}
