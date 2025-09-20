// import { Component, OnInit } from '@angular/core';
// import { TransferService } from '../../services/transfer.service';
// import { AuthService } from '../../services/auth.service';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
// })
// export class DashboardComponent implements OnInit {
//   balance: number | null = 0;
//   recentTransfers: any[] = [];
//   toUserId: number | null = null;
//   amount: number | null = null;
//   error: string = '';
//   success: string = '';

//   constructor(
//     private transferService: TransferService,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.loadUserData();
//   }

//   // loadUserData2() {
//   //   this.authService.getCurrentUser().subscribe({
//   //     next: (user) => {
//   //       this.balance = user.balance;
//   //       this.loadTransfers(user.id);
//   //     },
//   //   });
//   // } // resee this why the user get red ?
//   loadUserData() {
//     this.authService.getCurrentUser().subscribe({
//       next: (user) => {
//         if (user) {
//           this.balance = user.balance;
//           this.loadTransfers(user.id);
//         } else {
//           this.balance = null;
//         }
//       },
//     });
//   }

//   loadTransfers(userId: number) {
//     this.transferService.getTransfers(userId).subscribe({
//       next: (transfers) => {
//         this.recentTransfers = transfers.slice(-5).reverse(); // latest 5
//       },
//     });
//   }

//   sendTransfer() {
//     if (!this.toUserId || !this.amount) return;
//     this.error = '';
//     this.success = '';
//     this.authService.getCurrentUser().subscribe({
//       next: (user) => {
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
//               this.toUserId = null;
//               this.amount = null;
//             },
//             error: (err) =>
//               (this.error = err.error?.message || 'Transfer failed'),
//           });
//       },
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { TransferService } from '../../services/transfer.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of, switchMap } from 'rxjs';

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

//   // Transfer inputs
//   selectedBeneficiary: string = '';
//   selectedCountry: string = '';
//   toUserId: number | null = null;
//   amount: number | null = null;
//   receiverCurrency: string = 'USD';
//   convertedAmount: number | null = null;

//   // Beneficiaries
//   beneficiaries = [
//     { id: 2, name: 'Alice Smith', phone: '+1234567890' },
//     { id: 3, name: 'Bob Johnson', phone: '+1987654321' },
//     { id: 4, name: 'Carol Lee', phone: '+1122334455' },
//   ];
//   filteredBeneficiaries: any[] = [];
//   filteredCountries: any[] = [];

//   // Currencies & Rates (mocked)
//   // Currencies & Rates (mocked)
//   currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'XOF'];
//   rates: any = {
//     USD: 1,
//     EUR: 0.91,
//     GBP: 0.78,
//     JPY: 145.2,
//     CAD: 1.36,
//     XOF: 610,
//   };
//   countries = [
//     { name: 'United States', currency: 'USD' },
//     { name: 'European Union', currency: 'EUR' },
//     { name: 'United Kingdom', currency: 'GBP' },
//     { name: 'Japan', currency: 'JPY' },
//     { name: 'Canada', currency: 'CAD' },
//     { name: 'CFA Franc BCEAO', currency: 'XOF' },
//   ];

//   error: string = '';
//   success: string = '';

//   constructor(
//     private transferService: TransferService,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.loadUserData();
//   }

//   // Filter beneficiaries based on user input
//   filterBeneficiaries() {
//     const term = this.selectedBeneficiary.toLowerCase();
//     this.filteredBeneficiaries = this.beneficiaries.filter(
//       (b) => b.name.toLowerCase().includes(term) || b.phone.includes(term)
//     );
//   }

//   filterCountries() {
//     const term = this.selectedCountry.toLowerCase();
//     this.filteredCountries = this.countries.filter((c) =>
//       c.name.toLowerCase().includes(term)
//     );
//   }

//   // Add this method
//   chooseCountry(country: any) {
//     this.selectedCountry = country.name;
//     this.receiverCurrency = country.currency;
//     this.updateConvertedAmount(); // recalculate converted amount
//     this.filteredCountries = []; // hide dropdown after selection
//   }

//   // Select a beneficiary from the dropdown
//   chooseBeneficiary(b: any) {
//     this.selectedBeneficiary = b.name;
//     this.toUserId = b.id;
//     this.filteredBeneficiaries = [];
//   }

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

//   selectBeneficiary(b: any) {
//     this.selectedBeneficiary = b.name;
//     this.toUserId = b.id;
//     this.filteredBeneficiaries = [];
//   }

//   // Currency conversion
//   updateConvertedAmount() {
//     if (!this.amount) {
//       this.convertedAmount = null;
//       return;
//     }
//     const rate = this.rates[this.receiverCurrency] || 1;
//     this.convertedAmount = Math.round(this.amount * rate * 100) / 100;
//   }

//   sendTransfer() {
//     if (!this.toUserId || !this.amount) return;
//     this.error = '';
//     this.success = '';
//     this.authService.getCurrentUser().subscribe({
//       next: (user) => {
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
//             error: (err) =>
//               (this.error = err.error?.message || 'Transfer failed'),
//           });
//       },
//     });
//   }
// }
export class DashboardComponent implements OnInit {
  balance: number | null = 0;
  recentTransfers: any[] = [];

  // Beneficiaries
  selectedBeneficiary: string = '';
  toUserId: number | null = null;
  beneficiaries = [
    { id: 2, name: 'Alice Smith', phone: '+1234567890' },
    { id: 3, name: 'Bob Johnson', phone: '+1987654321' },
    { id: 4, name: 'Carol Lee', phone: '+1122334455' },
  ];
  filteredBeneficiaries: any[] = [];

  // Country & currency
  selectedCountry: string = '';
  receiverCurrency: string = 'USD';
  countries = [
    { name: 'United States', currency: 'USD' },
    { name: 'European Union', currency: 'EUR' },
    { name: 'United Kingdom', currency: 'GBP' },
    { name: 'Japan', currency: 'JPY' },
    { name: 'Canada', currency: 'CAD' },
    { name: 'CFA Franc BCEAO', currency: 'XOF' },
  ];
  filteredCountries: any[] = [];
  amount: number | null = null;
  convertedAmount: number | null = null;

  // Messages
  error: string = '';
  success: string = '';

  constructor(
    private transferService: TransferService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  // Load balance & recent transfers
  loadUserData() {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          this.balance = user.balance;
          this.loadTransfers(user.id);
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
      (b) => b.name.toLowerCase().includes(term) || b.phone.includes(term)
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
    this.updateConvertedAmount();
    this.filteredCountries = [];
  }

  // Currency conversion
  rates: any = {
    USD: 1,
    EUR: 0.91,
    GBP: 0.78,
    JPY: 145.2,
    CAD: 1.36,
    XOF: 625.95,
  };
  updateConvertedAmount() {
    if (!this.amount) return;
    const rate = this.rates[this.receiverCurrency] || 1;
    this.convertedAmount = Math.round(this.amount * rate * 100) / 100;
  }

  // Send transfer
  sendTransfer() {
    if (!this.toUserId || !this.amount) return;
    this.error = '';
    this.success = '';

    // this.authService.getCurrentUser().subscribe({
    //   next: (user:any) => {
    //     if (!user) return (this.error = 'User not found');
    //     this.transferService
    //       .createTransfer(user.id, this.toUserId!, this.amount!)
    //       .subscribe({
    //         next: () => {
    //           this.success = 'Transfer successful!';
    //           this.loadUserData();
    //           this.selectedBeneficiary = '';
    //           this.toUserId = null;
    //           this.amount = null;
    //           this.convertedAmount = null;
    //         },
    //         error: (err) =>
    //           (this.error = err.error?.message || 'Transfer failed'),
    //       });
    //   },
    // });

    this.authService.getCurrentUser().subscribe({
      next: (user: any) => {
        // or 'User | null' if you have a User interface
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

  // If you want, I can also refactor this code to be cleaner using switchMap so you don’t have nested subscriptions, which is more idiomatic in Angular.
  sendTransfer2() {
    if (!this.toUserId || !this.amount) return;

    this.error = '';
    this.success = '';

    this.authService
      .getCurrentUser()
      .pipe(
        switchMap((user: any) => {
          if (!user) {
            this.error = 'User not found';
            return of(null); // stop the chain
          }
          return this.transferService.createTransfer(
            user.id,
            this.toUserId!,
            this.amount!
          );
        }),
        catchError((err) => {
          this.error = err.error?.message || 'Transfer failed';
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          this.success = 'Transfer successful!';
          this.loadUserData();
          this.selectedBeneficiary = '';
          this.toUserId = null;
          this.amount = null;
          this.convertedAmount = null;
        }
      });
  }
}
