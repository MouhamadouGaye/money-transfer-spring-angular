// src/app/components/transaction-history/transaction-history.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransferService } from '../../services/transfer.service';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss'],
})
export class TransactionHistoryComponent implements OnInit {
  userId!: number;
  history: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private transferService: TransferService
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('userId'));

    this.transferService.getUserHead(this.userId).subscribe({
      next: (res: any) => {
        this.history = Array.isArray(res) ? res : [res];
      },
      error: (err: any) => {
        this.errorMessage = 'Could not load transaction history';
        console.error(err);
      },
    });
  }
}
