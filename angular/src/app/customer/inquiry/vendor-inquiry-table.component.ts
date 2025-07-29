import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { Inquiry } from '../vendor.model';

@Component({
  selector: 'app-vendor-inquiry-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-inquiry-table.component.html',
  styleUrls: ['./vendor-inquiry-table.component.css']
})
export class VendorInquiryTableComponent implements OnInit {
  inquiries: Inquiry[] = [];
  isLoading = true;
  vendorId: string | null = null;

  constructor(private vendorService: VendorService, private router: Router) {}

  ngOnInit(): void {
    this.vendorId = this.vendorService.getCurrentVendorId();
    if (!this.vendorId) {
      this.router.navigate(['/customer/login']);
      return;
    }
    this.loadInquiries();
  }

  loadInquiries(): void {
    if (!this.vendorId) return;
    this.isLoading = true;
    this.vendorService.getVendorInquiry(this.vendorId).subscribe({
      next: (inquiries) => {
        this.inquiries = inquiries;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Inquiries:', error);
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  goBack(): void {
    this.router.navigate(['/customer/dashboard']);
  }
} 