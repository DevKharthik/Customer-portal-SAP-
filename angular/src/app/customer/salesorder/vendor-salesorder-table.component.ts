import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { SalesOrder } from '../vendor.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendor-salesorder-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-salesorder-table.component.html',
  styleUrls: ['./vendor-salesorder-table.component.css']
})
export class VendorSalesorderTableComponent implements OnInit {
  salesOrders: SalesOrder[] = [];
  isLoading = true;
  vendorId: string | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 8;

  // Search
  searchTerm = '';

  get filteredSalesOrders(): SalesOrder[] {
    if (!this.searchTerm.trim()) return this.salesOrders;
    const term = this.searchTerm.trim().toLowerCase();
    return this.salesOrders.filter(order =>
      Object.values(order).some(val =>
        String(val).toLowerCase().includes(term)
      )
    );
  }

  get paginatedSalesOrders(): SalesOrder[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSalesOrders.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSalesOrders.length / this.pageSize) || 1;
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
    this.loadSalesOrders();
  }

  loadSalesOrders(): void {
    if (!this.vendorId) return;
    
    this.isLoading = true;
    this.vendorService.getVendorSalesOrder(this.vendorId).subscribe({
      next: (salesOrders) => {
        this.salesOrders = salesOrders;
        this.isLoading = false;
        this.currentPage = 1; // Reset to first page on refresh
      },
      error: (error) => {
        console.error('Error loading Sales Orders:', error);
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