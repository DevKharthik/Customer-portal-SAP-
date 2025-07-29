import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { VendorLogin } from '../vendor.model';

@Component({
  selector: 'app-vendor-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-login.component.html',
  styleUrls: ['./vendor-login.component.css']
})
export class VendorLoginComponent implements OnInit {
  credentials: VendorLogin = {
    customerId: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.credentials.customerId = '';
    this.credentials.password = '';
  }

  onLogin(): void {
    if (!this.credentials.customerId || !this.credentials.password) {
      this.errorMessage = 'Please enter both Customer ID and Password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.vendorService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login response:', response);

        if (response && response.message === 'Login successful.') {
          this.vendorService.setCurrentVendorId(this.credentials.customerId);
          this.router.navigate(['/customer/dashboard'])
            .then(navigated => {
              console.log('Navigated to dashboard:', navigated);
              if (!navigated) {
                alert('Navigation to dashboard failed. Please check your routes.');
              }
            })
            .catch(err => {
              console.error('Navigation error:', err);
              alert('Navigation error: ' + err);
            });
        } else {
          alert(response.message || 'Invalid login.');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
        console.error('Login error:', error);
        alert(this.errorMessage);
      }
    });
  }
}