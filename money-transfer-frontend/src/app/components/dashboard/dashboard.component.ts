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
// export class DashboardComponent implements OnInit {
//   balance: number | null = 0;
//   recentTransfers: any[] = [];

//   // Beneficiaries
//   selectedBeneficiary: string = '';
//   toUserId: number | null = null;
//   beneficiaries = [
//     { id: 2, name: 'Alice Smith', phone: '+1234567890' },
//     { id: 3, name: 'Bob Johnson', phone: '+1987654321' },
//     { id: 4, name: 'Carol Lee', phone: '+1122334455' },
//   ];
//   filteredBeneficiaries: any[] = [];

//   // Country & currency
//   selectedCountry: string = '';
//   receiverCurrency: string = 'USD';
//   countries = [
//     { name: 'United States', currency: 'USD' },
//     { name: 'European Union', currency: 'EUR' },
//     { name: 'United Kingdom', currency: 'GBP' },
//     { name: 'Japan', currency: 'JPY' },
//     { name: 'Canada', currency: 'CAD' },
//     { name: 'CFA Franc BCEAO', currency: 'XOF' },
//   ];
//   filteredCountries: any[] = [];
//   amount: number | null = null;
//   convertedAmount: number | null = null;

//   // Messages
//   error: string = '';
//   success: string = '';

//   constructor(
//     private transferService: TransferService,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.loadUserData();
//   }

//   // Load balance & recent transfers
//   loadUserData() {
//     this.authService.getCurrentUser().subscribe({
//       next: (user) => {
//         if (user) {
//           this.balance = user.balance;
//           this.loadTransfers(user.id);
//         }
//       },
//     });
//   }

//   loadTransfers(userId: number) {
//     this.transferService.getTransfers(userId).subscribe({
//       next: (transfers) => {
//         this.recentTransfers = transfers.slice(-5).reverse();
//       },
//     });
//   }

//   // Beneficiaries
//   filterBeneficiaries() {
//     const term = this.selectedBeneficiary.toLowerCase();
//     this.filteredBeneficiaries = this.beneficiaries.filter(
//       (b) => b.name.toLowerCase().includes(term) || b.phone.includes(term)
//     );
//   }

//   chooseBeneficiary(b: any) {
//     this.selectedBeneficiary = b.name;
//     this.toUserId = b.id;
//     this.filteredBeneficiaries = [];
//   }

//   // Countries
//   filterCountries() {
//     const term = this.selectedCountry.toLowerCase();
//     this.filteredCountries = this.countries.filter((c) =>
//       c.name.toLowerCase().includes(term)
//     );
//   }

//   chooseCountry(c: any) {
//     this.selectedCountry = c.name;
//     this.receiverCurrency = c.currency;
//     this.updateConvertedAmount();
//     this.filteredCountries = [];
//   }

//   // Currency conversion
//   rates: any = {
//     USD: 1,
//     EUR: 0.91,
//     GBP: 0.78,
//     JPY: 145.2,
//     CAD: 1.36,
//     XOF: 625.95,
//   };
//   updateConvertedAmount() {
//     if (!this.amount) return;
//     const rate = this.rates[this.receiverCurrency] || 1;
//     this.convertedAmount = Math.round(this.amount * rate * 100) / 100;
//   }

//   // Send transfer
//   sendTransfer() {
//     if (!this.toUserId || !this.amount) return;
//     this.error = '';
//     this.success = '';

//     this.authService.getCurrentUser().subscribe({
//       next: (user: any) => {
//         // or 'User | null' if you have a User interface
//         if (!user) {
//           this.error = 'User not found';
//           return;
//         }

//         this.transferService
//           .createTransfer(user.id, this.toUserId!, this.amount!)
//           .subscribe({
//             next: () => {
//               this.success = 'Transfer successful!';
//               this.loadUserData();
//               this.selectedBeneficiary = '';
//               this.toUserId = null;
//               this.amount = null;
//               this.convertedAmount = null;
//             },
//             error: (err) => {
//               this.error = err.error?.message || 'Transfer failed';
//             },
//           });
//       },
//       error: (err) => {
//         this.error = 'Failed to load current user';
//         console.error(err);
//       },
//     });
//   }

//   // If you want, I can also refactor this code to be cleaner using switchMap so you don’t have nested subscriptions, which is more idiomatic in Angular.
//   sendTransfer2() {
//     if (!this.toUserId || !this.amount) return;

//     this.error = '';
//     this.success = '';

//     this.authService
//       .getCurrentUser()
//       .pipe(
//         switchMap((user: any) => {
//           if (!user) {
//             this.error = 'User not found';
//             return of(null); // stop the chain
//           }
//           return this.transferService.createTransfer(
//             user.id,
//             this.toUserId!,
//             this.amount!
//           );
//         }),
//         catchError((err) => {
//           this.error = err.error?.message || 'Transfer failed';
//           return of(null);
//         })
//       )
//       .subscribe((res) => {
//         if (res) {
//           this.success = 'Transfer successful!';
//           this.loadUserData();
//           this.selectedBeneficiary = '';
//           this.toUserId = null;
//           this.amount = null;
//           this.convertedAmount = null;
//         }
//       });
//   }
// }
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
  dropdownOpen: boolean = false;

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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    this.dropdownOpen = false; // closes whenever you click outside
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

  // Beneficiaries
  filterBeneficiaries() {
    const term = this.selectedBeneficiary.toLowerCase();
    this.filteredBeneficiaries = this.beneficiaries.filter(
      (b) => b.name.toLowerCase().includes(term) || b.phoneNumber.includes(term)
    );
  }

  chooseBeneficiary(b: any) {
    this.selectedBeneficiary = b.name;
    this.toUserId = b.id;
    this.filteredBeneficiaries = [];
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
