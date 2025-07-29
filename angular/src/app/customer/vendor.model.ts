export interface VendorLogin {
  customerId: string;
  password: string;
}

// vendor.model.ts
export interface VendorProfile {
  CUSTOMER_NUMBER: string;
  NAME: string;
  STREET: string;
  CITY: string;
  COUNTRY: string;
  POSTAL: string;
}
export interface RFQ {
  Lifnr: string;
  Ebeln: string;
  Aedat: string;
  Bedat: string;
  Ekorg: string;
  Matnr: string;
  Ktmng: string;
  Netpr: string;
  Statu: string;
  Txz01: string;
}

export interface SalesOrder {
  VBELN: string;   // Sales Order Number
  ERDAT: string;   // Created Date
  MATNR: string;   // Material Number
  ARKTX: string;   // Material Description
  KWMENG: string;  // Order Quantity
  MEINS: string;   // Base Unit of Measure
  VRKME: string;   // Sales Unit
  WAERK: string;   // Currency
}
export interface PO {
  Lifnr: string;
  Ebeln: string;
  Aedat: string;
  Bedat: string;
  Ekorg: string;
  Matnr: string;
  Ktmng: string;
  Netpr: string;
  Statu: string;
  Txz01: string;
  Bstyp: string;
}


export interface GR{
      Mblnr: string,
      Mjahr: string,
      Matnr: string,
      Menge: string,
      Werks: string,
      Meins: string,
      BudatMkpf: string,
      Lifnr: string,
}

export interface INV {
      VBELN: string,   // Invoice Number
      FKDAT: string,   // Invoice Date
      NETWR: string,   // Net Value
      WAERK: string,   // Currency
      KUNAG: string,   // Sold-to Party
      KUNRG: string,   // Ship-to Party
      VKORG: string,   // Sales Organization
      ERDAT: string,   // Created Date
      VTWEG: string    // Distribution Channel
}


export interface PAY {
  VBELN: string;   // Invoice Number
  FKDAT: string;   // Invoice Date
  NETWR: string;   // Net Value
  WAERK: string;   // Currency
  DATS: string;    // Date
  AGING: string;   // Aging
}

export interface MEMO {
  VBELN: string;   // Memo Number
  FKART: string;   // Document Type
  FKDAT: string;   // Memo Date
  NETWR: string;   // Net Value
  WAERK: string;   // Currency
}

export interface SalesDelivery {
  VBELN: string;   // Delivery Number
  ERDAT: string;   // Date
  MATNR: string;   // Material Number
  ARKTX: string;   // Description
  LFIMG: string;   // Delivery Quantity
  MEINS: string;   // Base Unit
  VRKME: string;   // Sales Unit
  WAERK: string;   // Currency
}

export interface Inquiry {
  VBELN: string;   // Inquiry Number
  POSNR: string;   // Item Number
  MATNR: string;   // Material Number
  ARKTX: string;   // Material Description
  NETWR: string;   // Net Value
  VRKME: string;   // Sales Unit
  AUART: string;   // Document Type
  ERDAT: string;   // Created Date
  ERNAM: string;   // Created By
  WAERK: string;   // Currency
  ANGDT: string;   // Quotation Date
  BNDDT: string;   // Valid To Date
  POSAR: string;   // Item Category
}


export interface DashboardTile {
  title: string;
  count: number;
  route: string;
  color: string;
}

export interface OverallSales {
  TOTAL_COUNT: string;
  TOTAL_AMOUNT: string;
  CURRENCY: string;
}