import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { PAY } from '../vendor.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendor-pay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-pay-table.component.html',
  styleUrls: ['./vendor-pay-table.component.css']
})
export class VendorpayComponent implements OnInit {
  pays: PAY[] = [];
  isLoading = true;
  vendorId: string | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 8;

  // Search
  searchTerm = '';

  get filteredPays(): PAY[] {
    if (!this.searchTerm.trim()) return this.pays;
    const term = this.searchTerm.trim().toLowerCase();
    return this.pays.filter(pay =>
      Object.values(pay).some(val =>
        String(val).toLowerCase().includes(term)
      )
    );
  }

  get paginatedPays(): PAY[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPays.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPays.length / this.pageSize) || 1;
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
  }

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
        this.currentPage = 1; // Reset to first page on refresh
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
