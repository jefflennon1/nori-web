// ============================================================
// Tipos espelhando os DTOs reais de nori-sales e nori-stock
// ============================================================

export type Role = 'BUYER' | 'ADMIN' | 'OPERATOR' | 'SYSTEM';

export interface AuthUser {
  username: string;
  role: Role;
  sub: string; // subject do JWT
  exp: number;
  service: 'sales' | 'stock';
}

// ---------- nori-sales ----------

export interface CategorySalesDTO {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface ProductSalesDTO {
  id: string;
  name: string;
  description?: string;
  price: number;
  availableQuantity: number;
  active: boolean;
  category: CategorySalesDTO;
}

export interface ResponseUserDTO {
  username: string;
  email: string;
  role: Role;
  active: boolean;
}

export type OrderStatus = 'PENDING_PAYMENT' | 'PAYMENT_CONFIRMED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'EXPIRED';

export interface OrderItemDTO {
  product: ProductSalesDTO;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponseDTO {
  id: string;
  user: ResponseUserDTO;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItemDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemRequestDTO {
  productId: string;
  quantity: number;
}

export interface OrderRequestDTO {
  items: OrderItemRequestDTO[];
}

export interface PaymentResponseDTO {
  paymentId: string;
  amount: number;
  pixQrCode: string;
  pixQrCodeB64: string;
  status: PaymentStatus;
}

// ---------- nori-stock ----------

export interface CategoryStockDTO {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface SectorDTO {
  id: string;
  name: string;
  description?: string;
  location?: string;
  active: boolean;
}

export interface ProductStockDTO {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  quantity: number;
  minQuantity: number;
  active: boolean;
  category: CategoryStockDTO;
  sector: SectorDTO;
}

export type MovementType = 'OUTBOUND' | 'INBOUND' | 'ADJUSTMENT';

export interface StockMovementDTO {
  id: string;
  product: ProductStockDTO;
  sector: SectorDTO;
  user: ResponseUserDTO;
  type: MovementType;
  quantity: number;
  reason?: string;
  orderId?: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
