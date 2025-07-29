import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { VendorProfile } from '../vendor.model';  // ✅ make sure this now has Lifnr, Name1, etc.

@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.css']
})
export class VendorProfileComponent implements OnInit {
  profile: VendorProfile | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private vendorService: VendorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const vendorId = this.vendorService.getCurrentVendorId();
    
    if (!vendorId) {
      this.router.navigate(['/customer/login']);
      return;
    }

    this.loadProfile(vendorId);
  }

  loadProfile(vendorId: string): void {
    this.vendorService.getVendorProfile(vendorId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.error = 'Failed to load profile data';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/customer/dashboard']);
  }
}
