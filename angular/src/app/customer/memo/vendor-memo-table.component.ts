import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { MEMO } from '../vendor.model';

@Component({
  selector: 'app-vendor-memo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-memo-table.component.html',
  styleUrls: ['./vendor-memo-table.component.css']
})
export class VendormemoComponent implements OnInit {
  mems: MEMO[] = [];
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
    this.loadMemos();
  }

  loadMemos(): void {
    if (!this.vendorId) return;
    
    this.isLoading = true;
    this.vendorService.getVendorMEMO(this.vendorId).subscribe({
      next: (mems) => {
        this.mems = mems;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Memos:', error);
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
