import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { DashboardTile, VendorProfile } from '../vendor.model'; // ✅ Import VendorProfile

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit {
  isLoading = true;
  vendorId: string | null = null;
  vendorName: string = '';
  currentSection: 'dashboard' | 'finance' = 'dashboard';

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
    this.isLoading = false;
  }

  loadVendorProfile(): void {
    if (!this.vendorId) return;
    this.vendorService.getVendorProfile(this.vendorId).subscribe({
      next: (profile: VendorProfile) => {
        this.vendorName = profile.NAME || 'Vendor';
      },
      error: (error) => {
        console.error('Error loading vendor profile:', error);
      }
    });
  }

  showSection(section: 'dashboard' | 'finance') {
    this.currentSection = section;
  }

  navigateToProfile(): void {
    this.router.navigate(['/customer/profile']);
  }

  navigateTo(route: string): void {
    this.router.navigate([`/customer/${route}`]);
  }

  onLogout(): void {
    this.vendorService.logout();
    this.router.navigate(['/customer/login']);
  }
}
