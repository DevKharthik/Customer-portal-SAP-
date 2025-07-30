import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { FormsModule } from '@angular/forms';
// Remove import of SalesDelivery from model, use local interface

interface Delivery {
  deliveryNumber: string;
  createdDate: string;
  materialNumber: string;
  description: string;
  quantity: string;
  unit: string;
  currency: string;
}

@Component({
  selector: 'app-vendor-salesdelivery-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-salesdelivery-table.component.html',
  styleUrls: ['./vendor-salesdelivery-table.component.css']
})
export class VendorSalesdeliveryTableComponent implements OnInit {
  salesDeliveries: Delivery[] = [];
  isLoading = true;
  vendorId: string | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 8;

  // Search
  searchTerm = '';

  get filteredSalesDeliveries(): Delivery[] {
    if (!this.searchTerm.trim()) return this.salesDeliveries;
    const term = this.searchTerm.trim().toLowerCase();
    return this.salesDeliveries.filter(delivery =>
      Object.values(delivery).some(val =>
        String(val).toLowerCase().includes(term)
      )
    );
  }

  get paginatedSalesDeliveries(): Delivery[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSalesDeliveries.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSalesDeliveries.length / this.pageSize) || 1;
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
    this.loadSalesDeliveries();
  }

  loadSalesDeliveries(): void {
    if (!this.vendorId) return;
    this.isLoading = true;
    this.vendorService.getVendorSalesDelivery(this.vendorId).subscribe({
      next: (deliveries) => {
        this.salesDeliveries = deliveries;
        this.isLoading = false;
        this.currentPage = 1; // Reset to first page on refresh
      },
      error: (error) => {
        console.error('Error loading Sales Deliveries:', error);
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    if (dateString.includes('/Date(')) {
      const timestamp = parseInt(dateString.replace(/[^0-9]/g, ''), 10);
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
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