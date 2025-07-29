import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/customer/login', pathMatch: 'full' },
  {
    path: 'customer/login',
    loadComponent: () =>
      import('./customer/login/vendor-login.component').then(m => m.VendorLoginComponent)
  },
  
  {
    path: 'customer/dashboard',
    loadComponent: () =>
      import('./customer/dashboard/vendor-dashboard.component').then(m => m.VendorDashboardComponent)
  },
  {
    path: 'customer/profile',
    loadComponent: () =>
      import('./customer/profile/vendor-profile.component').then(m => m.VendorProfileComponent)
  },
  {
    path: 'customer/salesorder',
    loadComponent: () =>
      import('./customer/salesorder/vendor-salesorder-table.component').then(m => m.VendorSalesorderTableComponent)
  },

  {
    path: 'customer/inv',
    loadComponent: () =>
      import('./customer/invoice/vendor-invoice-table.component').then(m => m.VendorInvoiceTableComponent)
  },
  {
    path: 'customer/memo',
    loadComponent: () =>
      import('./customer/memo/vendor-memo-table.component').then(m => m.VendormemoComponent)
  },
  {
    path: 'customer/pay',
    loadComponent: () =>
      import('./customer/pay/vendor-pay-table.component').then(m => m.VendorpayComponent)
  },
  {
    path: 'customer/salesdelivery',
    loadComponent: () =>
      import('./customer/salesdelivery/vendor-salesdelivery-table.component').then(m => m.VendorSalesdeliveryTableComponent)
  },
  {
    path: 'customer/inquiry',
    loadComponent: () =>
      import('./customer/inquiry/vendor-inquiry-table.component').then(m => m.VendorInquiryTableComponent)
  },
  {
    path: 'customer/overallsales',
    loadComponent: () =>
      import('./customer/overallsales/vendor-overallsales.component').then(m => m.VendorOverallsalesComponent)
  },
  { path: '**', redirectTo: '/customer/login' }
];
