import type { Messages } from './messages.pt';

const messages: Messages = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    select: 'Select...',
    name: 'Name',
    description: 'Description',
    logout: 'Log out',
  },

  pagination: {
    showing: (from: number, to: number, total: number) => `Showing ${from}–${to} of ${total}`,
    prev: 'Previous',
    next: 'Next',
  },

  toast: {
    productCreated: 'Product created successfully!',
    categoryCreated: 'Category created successfully!',
    sectorCreated: 'Sector created successfully!',
    movementCreated: 'Movement registered successfully!',
    orderCreated: 'Order placed successfully!',
    pixGenerated: 'Pix QR Code generated!',
    genericError: 'An error occurred. Please try again.',
  },

  nav: {
    dashboard: 'Dashboard',
    catalog: 'Catalog',
    cart: 'Cart',
    myOrders: 'My orders',
    products: 'Products',
    categories: 'Categories',
    orders: 'Orders',
    sectors: 'Sectors',
    movements: 'Movements',
  },

  shell: {
    workspaceStore: 'Store',
    workspaceSalesAdmin: 'Sales — Admin',
    workspaceStock: 'Inventory',
    accentBuyer: 'Buyer',
    accentAdmin: 'Admin',
    accentOperator: 'Operator',
  },

  login: {
    title: 'Nori Portfolio',
    subtitle: 'Sales & inventory platform',
    tabSales: 'Sales / Store',
    tabStock: 'Inventory',
    usernameLabel: 'Username',
    usernamePlaceholderSales: 'e.g. maria_buyer',
    usernamePlaceholderStock: 'e.g. operator_demo',
    passwordLabel: 'Password',
    submit: 'Sign in',
    invalidCredentials: 'Invalid username or password.',
    helpSales: 'Buyers and store admins sign in here.',
    helpStock: 'Inventory operators and admins sign in here.',
  },

  buyer: {
    catalog: {
      title: 'Catalog',
      subtitle: 'Products available for purchase',
      empty: 'No products available',
      outOfStock: 'Out of stock',
      available: (n: number) => `${n} available`,
      addToCart: 'Add',
    },
    cart: {
      title: 'Cart',
      itemCount: (n: number) => `${n} item(s)`,
      perUnit: '/ unit',
      emptyTitle: 'Your cart is empty',
      emptyDescription: 'Add products from the catalog to continue.',
      viewCatalog: 'View catalog',
      total: 'Total',
      checkout: 'Place order',
      checkoutError: 'Could not place the order. Check item availability.',
    },
    orders: {
      title: 'My orders',
      empty: "You don't have any orders yet",
      orderNumber: (id: string) => `Order #${id}`,
      status: {
        PENDING_PAYMENT: 'Payment pending',
        PAYMENT_CONFIRMED: 'Payment confirmed',
        CANCELLED: 'Cancelled',
      },
    },
    orderDetail: {
      items: 'Items',
      total: 'Total',
      pixTitle: 'Payment via Pix',
      generatePix: 'Generate Pix QR Code',
      qrAlt: 'Pix QR Code',
      copyPix: 'Copy Pix code',
      copied: 'Copied!',
      pixHint: 'After payment, confirmation arrives automatically via the Mercado Pago webhook.',
    },
  },

  salesAdmin: {
    dashboard: {
      title: 'Dashboard — Sales',
      subtitle: 'Store overview',
      statProducts: 'Products',
      statCategories: 'Categories',
      statOrders: 'Orders',
      statRevenue: 'Confirmed revenue',
    },
    products: {
      title: 'Products',
      subtitle: 'Store catalog',
      newProduct: 'New product',
      empty: 'No products registered',
      inStock: (n: number) => `${n} in stock`,
      fieldCategory: 'Category',
      fieldPrice: 'Price (R$)',
      fieldAvailableQty: 'Available qty.',
      fieldAboutAvailableQty: 'The available quantity of a product is changed only by the inventory system.'
    },
    categories: {
      title: 'Categories',
      newCategory: 'New category',
      empty: 'No categories registered',
    },
    orders: {
      title: 'Orders',
      empty: 'No orders found',
    },
  },

  stock: {
    dashboard: {
      title: 'Dashboard — Inventory',
      subtitle: 'Warehouse overview',
      statProducts: 'Products',
      statSectors: 'Sectors',
      statMovements: 'Movements',
      statLowStock: 'Low stock',
      lowStockTitle: 'Products below minimum stock',
      minLabel: (qty: number, min: number) => `${qty} / min. ${min}`,
    },
    products: {
      title: 'Products',
      subtitle: 'Physical stock by sector',
      newProduct: 'New product',
      empty: 'No products registered',
      fieldSector: 'Sector',
      fieldSku: 'SKU',
      fieldInitialQty: 'Initial quantity',
      fieldMinQty: 'Min. quantity',
      unitsLabel: (qty: number, min: number) => `${qty} units (min. ${min})`,
    },
    categories: {
      title: 'Categories',
      newCategory: 'New category',
      empty: 'No categories registered',
    },
    sectors: {
      title: 'Sectors',
      newSector: 'New sector',
      empty: 'No sectors registered',
      fieldLocation: 'Location',
    },
    movements: {
      title: 'Movements',
      subtitleBefore: 'Includes manual and automatic movements (generated via Kafka by the',
      subtitleAfter: 'consumer)',
      newMovement: 'New movement',
      empty: 'No movements registered',
      fieldProduct: 'Product',
      fieldSector: 'Sector',
      fieldType: 'Type',
      fieldQuantity: 'Quantity',
      fieldReason: 'Reason',
      register: 'Register',
      by: 'by',
      type: {
        INBOUND: 'Inbound',
        OUTBOUND: 'Outbound',
        ADJUSTMENT: 'Adjustment',
      },
    },
  },
};

export default messages;
