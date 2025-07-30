import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { Inquiry } from '../vendor.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendor-inquiry-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-inquiry-table.component.html',
  styleUrls: ['./vendor-inquiry-table.component.css']
})
export class VendorInquiryTableComponent implements OnInit {
  inquiries: Inquiry[] = [];
  isLoading = true;
  vendorId: string | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 8;

  // Search
  searchTerm = '';

  get filteredInquiries(): Inquiry[] {
    if (!this.searchTerm.trim()) return this.inquiries;
    const term = this.searchTerm.trim().toLowerCase();
    return this.inquiries.filter(inq =>
      Object.values(inq).some(val =>
        String(val).toLowerCase().includes(term)
      )
    );
  }

  get paginatedInquiries(): Inquiry[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredInquiries.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredInquiries.length / this.pageSize) || 1;
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
        this.currentPage = 1; // Reset to first page on refresh
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