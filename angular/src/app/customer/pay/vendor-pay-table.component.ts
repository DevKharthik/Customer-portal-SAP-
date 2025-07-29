import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { PAY } from '../vendor.model';

@Component({
  selector: 'app-vendor-pay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-pay-table.component.html',
  styleUrls: ['./vendor-pay-table.component.css']
})
export class VendorpayComponent implements OnInit {
  pays: PAY[] = [];
  isLoading = true;
  vendorId: string | null = null;

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vendorId = this.vendorService.getCurrentVendorId();
    if (!this.vendorId) {
      this.router.navigate(['/customer/login']);
      return;
    }
    this.loadPays();
  }

  loadPays(): void {
    if (!this.vendorId) return;
    
    this.isLoading = true;
    this.vendorService.getVendorPAY(this.vendorId).subscribe({
      next: (pays) => {
        this.pays = pays;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Pays:', error);
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    // Handle OData date format (e.g., "/Date(1234567890000)/")
    if (dateString.includes('/Date(')) {
      const timestamp = parseInt(dateString.replace(/[^0-9]/g, ''), 10);
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // Handle regular date strings
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  }

  goBack(): void {
    this.router.navigate(['/customer/dashboard']);
  }
}
