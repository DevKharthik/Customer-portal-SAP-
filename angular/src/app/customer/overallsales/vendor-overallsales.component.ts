import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { OverallSales } from '../vendor.model';

@Component({
  selector: 'app-vendor-overallsales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-overallsales.component.html',
  styleUrls: ['./vendor-overallsales.component.css']
})
export class VendorOverallsalesComponent implements OnInit {
  overallSales: OverallSales[] = [];
  isLoading = true;
  vendorId: string | null = null;
  vendorName: string = '';
  error: string | null = null;

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vendorId = this.vendorService.getCurrentVendorId();

    if (!this.vendorId) {
      console.warn('No vendor ID found, redirecting to login.');
      this.router.navigate(['/customer/login']);
      return;
    }

    this.loadVendorProfile();
    this.loadOverallSales();
  }

  loadVendorProfile(): void {
    if (!this.vendorId) return;

    this.vendorService.getVendorProfile(this.vendorId).subscribe({
      next: (profile) => {
        this.vendorName = profile.NAME || 'Vendor';
      },
      error: (error) => {
        console.error('Error loading vendor profile:', error);
      }
    });
  }

  loadOverallSales(): void {
    if (!this.vendorId) return;

    this.vendorService.getVendorOverallSales(this.vendorId).subscribe({
      next: (data) => {
        this.overallSales = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading overall sales:', error);
        this.error = 'Failed to load overall sales data';
        this.isLoading = false;
      }
    });
  }

  onLogout(): void {
    this.vendorService.logout();
    this.router.navigate(['/customer/login']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/customer/profile']);
  }

  navigateTo(route: string): void {
    this.router.navigate([`/customer/${route}`]);
  }

  goBack(): void {
    this.router.navigate(['/customer/dashboard']);
  }

  formatCurrency(amount: string, currency: string): string {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return `${amount} ${currency}`;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount);
  }
} 