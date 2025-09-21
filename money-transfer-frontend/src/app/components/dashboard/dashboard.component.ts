import { Component, HostListener, OnInit } from '@angular/core';
import { TransferService } from '../../services/transfer.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, empty, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private transferService: TransferService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }
  balance: number | null = 0;
  recentTransfers: any[] = [];
  warningMessage =
    'The date of 24 september, Our services will be on maintenancy!';

  // Beneficiaries
  selectedBeneficiary: string = '';
  toUserId: number | null = null;

  beneficiaries = [
    { id: 1, name: 'kobe', phoneNumber: '+1234567890' },
    { id: 3, name: 'lima', phoneNumber: '0635544534' },
    { id: 3, name: 'Hawa', phoneNumber: '0789897856' },
    { id: 4, name: 'Ameth', phoneNumber: '0664741506' },
  ];

  filteredBeneficiaries: any[] = [];

  // Sender (local currency, e.g. USD)
  senderCurrency: string = 'USD';

  // Destination country & currency
  selectedCountry: string = '';
  receiverCurrency: string = '';
  countries = [
    { name: 'United States', currency: 'USD' },
    { name: 'European Union', currency: 'EUR' },
    { name: 'United Kingdom', currency: 'GBP' },
    { name: 'Japan', currency: 'JPY' },
    { name: 'Canada', currency: 'CAD' },
    { name: 'CFA Franc BCEAO', currency: 'XOF' },
  ];
  filteredCountries: any[] = [];

  // Amounts
  amount: number | null = null;
  convertedAmount: number | null = null;

  amountSender: number | null = null;
  amountReceiver: number | null = null;

  // Conversion rates (mock)
  rates: any = {
    USD: 1,
    EUR: 0.91,
    GBP: 0.78,
    JPY: 145.2,
    CAD: 1.36,
    XOF: 625.95,
  };

  // Messages
  error: string = '';
  success: string = '';

  dropdownOpen = false;
  beneficiaryDropdownOpen = false;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    this.dropdownOpen = false; // closes whenever you click outside
    this.beneficiaryDropdownOpen = false;
  }

  // Load balance & recent transfers
  loadUserData() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          this.balance = user.balance;
          this.loadTransfers(user.id);
          this.senderCurrency = user.currency || 'USD'; // ✅ local currency
        }
      },
    });
  }

  loadTransfers(userId: number) {
    this.transferService.getTransfers(userId).subscribe({
      next: (transfers) => {
        this.recentTransfers = transfers.slice(-5).reverse();
      },
    });
  }

  // // Beneficiaries
  // filterBeneficiaries() {
  //   const term = this.selectedBeneficiary.toLowerCase();
  //   this.filteredBeneficiaries = this.beneficiaries.filter(
  //     (b) => b.name.toLowerCase().includes(term) || b.phoneNumber.includes(term)
  //   );
  // }
  filterBeneficiaries() {
    const term = this.selectedBeneficiary.toLowerCase();
    this.filteredBeneficiaries = this.beneficiaries.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        b.phoneNumber.toLowerCase().includes(term)
    );
  }
  chooseBeneficiary(b: any) {
    this.selectedBeneficiary = `${b.name} - (${b.phoneNumber})`;
    this.toUserId = b.id;
    this.filteredBeneficiaries = [];
    this.beneficiaryDropdownOpen = false;
  }

  // Countries
  filterCountries() {
    const term = this.selectedCountry.toLowerCase();
    this.filteredCountries = this.countries.filter((c) =>
      c.name.toLowerCase().includes(term)
    );
  }

  chooseCountry(c: any) {
    this.selectedCountry = c.name;
    this.receiverCurrency = c.currency;
    this.updateConvertedAmount('sender');
    this.filteredCountries = [];
    this.dropdownOpen = false; // close dropdown when selecting
  }

  //utility
  round2(value: number): number {
    return Number(value.toFixed(2));
  }

  updateConvertedAmount(source: 'sender' | 'receiver') {
    const rate = this.rates[this.receiverCurrency] || 1;

    if (source === 'sender') {
      if (!this.amountSender && this.amountSender !== 0) {
        this.amountReceiver = null;
        return;
      }
      this.amountReceiver = this.round2(this.amountSender * rate);
    }

    if (source === 'receiver') {
      if (!this.amountReceiver && this.amountReceiver !== 0) {
        this.amountSender = null;
        return;
      }
      this.amountSender = this.round2(this.amountReceiver / rate);
    }
  }

  // Send transfer
  sendTransfer() {
    if (!this.toUserId || !this.amount) return;
    this.error = '';
    this.success = '';

    this.authService.getCurrentUser().subscribe({
      next: (user: any) => {
        if (!user) {
          this.error = 'User not found';
          return;
        }

        this.transferService
          .createTransfer(user.id, this.toUserId!, this.amount!)
          .subscribe({
            next: () => {
              this.success = 'Transfer successful!';
              this.loadUserData();
              this.selectedBeneficiary = '';
              this.toUserId = null;
              this.amount = null;
              this.convertedAmount = null;
            },
            error: (err) => {
              this.error = err.error?.message || 'Transfer failed';
            },
          });
      },
      error: (err) => {
        this.error = 'Failed to load current user';
        console.error(err);
      },
    });
  }
}
