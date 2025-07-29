import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map,catchError  } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Observable, of, delay } from 'rxjs';
import { 
  VendorLogin, 
  VendorProfile, 
  RFQ, 
  SalesOrder,
  PO, 
  GR, 
  DashboardTile, 
  INV,
  MEMO,
  PAY,
  SalesDelivery,
  Inquiry,
  OverallSales
} from './vendor.model';

// Add Delivery interface for type safety
interface Delivery {
  deliveryNumber: string;
  createdDate: string;
  materialNumber: string;
  description: string;
  quantity: string;
  unit: string;
  currency: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private currentVendorId: string | null = null;

 constructor(private http: HttpClient, private router: Router) {}
  


  login(credentials: VendorLogin): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/customer/login', {
      customerId: credentials.customerId,
      password: credentials.password
    });
  }

  setCurrentVendorId(id: string): void {
  this.currentVendorId = id;
  localStorage.setItem('customerId', id); // ✅ store in localStorage
}
 
  getCurrentVendorId(): string | null {
  if (!this.currentVendorId) {
    this.currentVendorId = localStorage.getItem('customerId'); // ✅ read from localStorage
  }
  return this.currentVendorId;
}

 logout(): void {
  this.currentVendorId = null;
  localStorage.removeItem('customerId'); // ✅ clear it
  this.router.navigate(['/customer/login']);
}

  // getDashboardTiles(): Observable<any> {
  //   return this.http.get<any>('http://localhost:5000/api/vendor/dashboard-tiles');
  // }


  // Vendor Profile
getVendorProfile(vendorId: string): Observable<VendorProfile> {
  return this.http.post<{ success: boolean; data: VendorProfile }>(
    `http://localhost:3000/api/customer/profile`,
    { CUSTOMER_ID: vendorId }
  ).pipe(
    map(response => response.data)
  );
}
  // Dashboard Tiles
  getDashboardTiles(): Observable<DashboardTile[]> {
    const tiles: DashboardTile[] = [
      {
        title: 'Sales Order',
        count: 12,
        route: '/customer/salesorder',
        color: '#3b82f6'
      },
      {
        title: 'Sales Delivery',
        count: 8,
        route: '/customer/salesdelivery',
        color: '#10b981'
      },
      {
        title: 'Inquiry',
        count: 7,
        route: '/customer/inquiry',
        color: '#f59e0b'
      },
      {
        title: 'Overall Sales',
        count: 0,
        route: '/customer/overallsales',
        color: '#8b5cf6'
      },
      {
        title: 'Finance',
        count: 3,
        route: '/customer/finance',
        color: '#8b5cf6'
      }
    ];
    
    return of(tiles).pipe(delay(500));
  }

  getVendorRfq(vendorId: string): Observable<RFQ[]> {
  return this.http.get<{ success: boolean; data: RFQ[] }>(
    `http://localhost:5000/api/vendor/rfq/${vendorId}`
  ).pipe(
    map(response => response.data)
  );
}

getVendorSalesOrder(vendorId: string): Observable<SalesOrder[]> {
  return this.http.post<{ success: boolean; data: SalesOrder[] }>(
    `http://localhost:3000/api/customer/salesorder`,
    { CUSTOMER_ID: vendorId }
  ).pipe(
    map(response => response.data)
  );
}

getVendorPO(vendorId: string): Observable<PO[]> {
  return this.http.get<{ success: boolean; data: PO[] }>(
    `http://localhost:5000/api/vendor/po/${vendorId}`
  ).pipe(
    map(response => response.data)
  );
}

getVendorGR(vendorId: string): Observable<GR[]> {
  return this.http.get<{ success: boolean; data: GR[] }>(
    `http://localhost:5000/api/vendor/gr/${vendorId}`
  ).pipe(
    map(response => response.data)
  );
}

  // Financial Data
getVendorINV(vendorId: string): Observable<INV[]> {
  return this.http.post<{ success: boolean; data: INV[] }>(
    `http://localhost:3000/api/customer/invoice`,
    { CUSTOMER_ID: vendorId }
  ).pipe(
    map(response => response.data)
  );
}

  getVendorPAY(vendorId: string): Observable<PAY[]> {
  return this.http.post<{ success: boolean; data: PAY[] }>(
    `http://localhost:3000/api/customer/aging`,
    { CUSTOMER_ID: vendorId }
  ).pipe(
    map(response => response.data)
  );
}
  getVendorMEMO(vendorId: string): Observable<MEMO[]> {
  return this.http.post<{ success: boolean; data: MEMO[] }>(
    `http://localhost:3000/api/customer/memo`,
    { CUSTOMER_ID: vendorId }
  ).pipe(
    map(response => response.data)
  );
}

  getVendorSalesDelivery(vendorId: string): Observable<Delivery[]> {
  return this.http.post<{ success: boolean; data: Delivery[] }>(
    `http://localhost:3000/api/customer/delivery`,
    { CUSTOMER_ID: vendorId }
  ).pipe(
    map(response => response.data)
  );
}

  getVendorInquiry(vendorId: string): Observable<Inquiry[]> {
  return this.http.post<{ success: boolean; data: Inquiry[] }>(
    `http://localhost:3000/api/customer/inquiry`,
    { CUSTOMER_ID: vendorId }
  ).pipe(
    map(response => response.data)
  );
}

  getVendorOverallSales(vendorId: string): Observable<OverallSales[]> {
  return this.http.post<{ success: boolean; data: OverallSales[] }>(
    `http://localhost:3000/api/customer/overallsales`,
    { CUSTOMER_ID: vendorId }
  ).pipe(
    map(response => response.data)
  );
}

  getInvoicePdf(vbeln: string): Observable<{ success: boolean; vbeln: string; pdfBase64: string }> {
    return this.http.post<{ success: boolean; vbeln: string; pdfBase64: string }>(
      `http://localhost:5000/api/customer/form`,
      { VBELN: vbeln }
    );
  }


}