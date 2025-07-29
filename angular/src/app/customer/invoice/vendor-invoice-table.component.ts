import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { INV } from '../vendor.model';

@Component({
  selector: 'app-vendor-invoice-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-invoice-table.component.html',
  styleUrls: ['./vendor-invoice-table.component.css']
})
export class VendorInvoiceTableComponent implements OnInit {
  invs: INV[] = [];
  isLoading = true;
  vendorId: string | null = null;
  isDownloading: { [belnr: string]: boolean } = {};

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
    this.loadInvoices();
  }

  loadInvoices(): void {
    if (!this.vendorId) return;
    
    this.isLoading = true;
    this.vendorService.getVendorINV(this.vendorId).subscribe({
      next: (invs) => {
        this.invs = invs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Invoices:', error);
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

  downloadInvoicePdf(vbeln: string): void {
    if (this.isDownloading[vbeln]) return;
    this.isDownloading[vbeln] = true;
    this.vendorService.getInvoicePdf(vbeln).subscribe({
      next: (response) => {
        if (response.success && response.pdfBase64) {
          // Convert base64 to blob and download
          const byteCharacters = atob(response.pdfBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice_${vbeln}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
          console.log(`Invoice ${vbeln} downloaded successfully`);
        } else {
          console.error('PDF download failed: Invalid response');
        }
        this.isDownloading[vbeln] = false;
      },
      error: (error) => {
        console.error('Error downloading invoice:', error);
        alert(`Failed to download invoice ${vbeln}. Please try again later.`);
        this.isDownloading[vbeln] = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/customer/dashboard']);
  }
} 