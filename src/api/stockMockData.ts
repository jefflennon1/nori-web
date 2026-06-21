import type { CategoryStockDTO, ProductStockDTO, SectorDTO, StockMovementDTO } from '@/types';

// Dados de demonstração — usados como fallback automático quando os endpoints
// reais de CRUD do nori-stock ainda não respondem (ver stockApi.ts).
// Espelham o seed da migration V6 para manter consistência com o backend real.

export const mockCategories: CategoryStockDTO[] = [
  { id: 'b1c2d3e4-0000-0000-0000-000000000001', name: 'Electronics', description: 'Smartphones, laptops and accessories', active: true },
  { id: 'b1c2d3e4-0000-0000-0000-000000000002', name: 'Books', description: 'Physical and digital books', active: true },
  { id: 'b1c2d3e4-0000-0000-0000-000000000003', name: 'Peripherals', description: 'Keyboards, mice and headsets', active: true },
];

export const mockSectors: SectorDTO[] = [
  { id: 'c1d2e3f4-0000-0000-0000-000000000001', name: 'Sector A', description: 'High-value electronics storage', location: 'Building A - Floor 1', active: true },
  { id: 'c1d2e3f4-0000-0000-0000-000000000002', name: 'Sector B', description: 'Books and printed materials', location: 'Building A - Floor 2', active: true },
  { id: 'c1d2e3f4-0000-0000-0000-000000000003', name: 'Sector C', description: 'Peripherals and accessories', location: 'Building B - Floor 1', active: true },
];

export const mockProducts: ProductStockDTO[] = [
  { id: 'p-001', name: 'Smartphone X Pro', description: 'Flagship smartphone 256GB', sku: 'SKU-ELEC-001', quantity: 50, minQuantity: 10, active: true, category: mockCategories[0], sector: mockSectors[0] },
  { id: 'p-002', name: 'UltraBook Laptop', description: 'Lightweight laptop 16GB RAM 512GB SSD', sku: 'SKU-ELEC-002', quantity: 30, minQuantity: 5, active: true, category: mockCategories[0], sector: mockSectors[0] },
  { id: 'p-003', name: 'Clean Code', description: 'Robert C. Martin', sku: 'SKU-BOOK-001', quantity: 100, minQuantity: 20, active: true, category: mockCategories[1], sector: mockSectors[1] },
  { id: 'p-004', name: 'Domain-Driven Design', description: 'Eric Evans', sku: 'SKU-BOOK-002', quantity: 80, minQuantity: 15, active: true, category: mockCategories[1], sector: mockSectors[1] },
  { id: 'p-005', name: 'RGB Mechanical Keyboard', description: 'Red switch, US layout', sku: 'SKU-PERI-001', quantity: 8, minQuantity: 10, active: true, category: mockCategories[2], sector: mockSectors[2] },
  { id: 'p-006', name: 'Wireless Gaming Mouse', description: '12000 DPI optical mouse', sku: 'SKU-PERI-002', quantity: 75, minQuantity: 15, active: true, category: mockCategories[2], sector: mockSectors[2] },
];

const systemUser = { username: 'system', email: 'system@nori-stock.internal', role: 'SYSTEM' as const, active: true };
const operatorUser = { username: 'operator_demo', email: 'operator@demo.com', role: 'OPERATOR' as const, active: true };

export const mockMovements: StockMovementDTO[] = [
  { id: 'm-001', product: mockProducts[0], sector: mockSectors[0], user: systemUser, type: 'OUTBOUND', quantity: 2, reason: 'Sale confirmed, order: a1b2c3', orderId: 'a1b2c3', createdAt: new Date(Date.now() - 3600_000).toISOString() },
  { id: 'm-002', product: mockProducts[4], sector: mockSectors[2], user: operatorUser, type: 'INBOUND', quantity: 20, reason: 'Restock from supplier', createdAt: new Date(Date.now() - 86_400_000).toISOString() },
  { id: 'm-003', product: mockProducts[2], sector: mockSectors[1], user: operatorUser, type: 'ADJUSTMENT', quantity: 5, reason: 'Inventory count correction', createdAt: new Date(Date.now() - 172_800_000).toISOString() },
];
