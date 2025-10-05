import { 
  type User, type InsertUser,
  type Category, type InsertCategory,
  type SubCategory, type InsertSubCategory,
  type Brand, type InsertBrand,
  type Unit, type InsertUnit,
  type VariantAttribute, type InsertVariantAttribute,
  type Warranty, type InsertWarranty,
  type Product, type InsertProduct,
  type Customer, type InsertCustomer,
  type Supplier, type InsertSupplier,
  type Sale, type InsertSale,
  type SaleItem, type InsertSaleItem,
  type Purchase, type InsertPurchase,
  type PurchaseItem, type InsertPurchaseItem,
  type Expense, type InsertExpense,
  type StockAdjustment, type InsertStockAdjustment,
  type StockTransfer, type InsertStockTransfer,
  type PurchaseOrder, type InsertPurchaseOrder,
  type PurchaseOrderItem, type InsertPurchaseOrderItem,
  type SalesReturn, type InsertSalesReturn,
  type SalesReturnItem, type InsertSalesReturnItem,
  type PurchaseReturn, type InsertPurchaseReturn,
  type PurchaseReturnItem, type InsertPurchaseReturnItem,
  users,
  categories,
  subCategories,
  brands,
  units,
  variantAttributes,
  warranties,
  products,
  customers,
  suppliers,
  sales,
  saleItems,
  purchases,
  purchaseItems,
  expenses,
  stockAdjustments,
  stockTransfers,
  purchaseOrders,
  purchaseOrderItems,
  salesReturns,
  salesReturnItems,
  purchaseReturns,
  purchaseReturnItems
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, lte, sql, sum, count } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategoryId(categoryId: string): Promise<Product[]>;
  getLowStockProducts(): Promise<Product[]>;
  getExpiredProducts(): Promise<Product[]>;
  getTopSellingProducts(limit?: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getTopCustomers(limit?: number): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;

  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: string): Promise<boolean>;

  // Sales
  getSales(): Promise<Sale[]>;
  getSale(id: string): Promise<Sale | undefined>;
  getRecentSales(limit?: number): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
  updateSale(id: string, sale: Partial<InsertSale>): Promise<Sale | undefined>;

  // Sale Items
  getSaleItems(saleId: string): Promise<SaleItem[]>;
  createSaleItem(saleItem: InsertSaleItem): Promise<SaleItem>;

  // Purchases
  getPurchases(): Promise<Purchase[]>;
  getPurchase(id: string): Promise<Purchase | undefined>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  updatePurchase(id: string, purchase: Partial<InsertPurchase>): Promise<Purchase | undefined>;

  // Purchase Items
  getPurchaseItems(purchaseId: string): Promise<PurchaseItem[]>;
  createPurchaseItem(purchaseItem: InsertPurchaseItem): Promise<PurchaseItem>;

  // Expenses
  getExpenses(): Promise<Expense[]>;
  getExpense(id: string): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: string, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: string): Promise<boolean>;

  // SubCategories
  getSubCategories(): Promise<SubCategory[]>;
  getSubCategory(id: string): Promise<SubCategory | undefined>;
  getSubCategoriesByCategoryId(categoryId: string): Promise<SubCategory[]>;
  createSubCategory(subCategory: InsertSubCategory): Promise<SubCategory>;
  updateSubCategory(id: string, subCategory: Partial<InsertSubCategory>): Promise<SubCategory | undefined>;
  deleteSubCategory(id: string): Promise<boolean>;

  // Brands
  getBrands(): Promise<Brand[]>;
  getBrand(id: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: string): Promise<boolean>;

  // Units
  getUnits(): Promise<Unit[]>;
  getUnit(id: string): Promise<Unit | undefined>;
  createUnit(unit: InsertUnit): Promise<Unit>;
  updateUnit(id: string, unit: Partial<InsertUnit>): Promise<Unit | undefined>;
  deleteUnit(id: string): Promise<boolean>;

  // VariantAttributes
  getVariantAttributes(): Promise<VariantAttribute[]>;
  getVariantAttribute(id: string): Promise<VariantAttribute | undefined>;
  createVariantAttribute(variantAttribute: InsertVariantAttribute): Promise<VariantAttribute>;
  updateVariantAttribute(id: string, variantAttribute: Partial<InsertVariantAttribute>): Promise<VariantAttribute | undefined>;
  deleteVariantAttribute(id: string): Promise<boolean>;

  // Warranties
  getWarranties(): Promise<Warranty[]>;
  getWarranty(id: string): Promise<Warranty | undefined>;
  createWarranty(warranty: InsertWarranty): Promise<Warranty>;
  updateWarranty(id: string, warranty: Partial<InsertWarranty>): Promise<Warranty | undefined>;
  deleteWarranty(id: string): Promise<boolean>;

  // StockAdjustments
  getStockAdjustments(): Promise<StockAdjustment[]>;
  getStockAdjustment(id: string): Promise<StockAdjustment | undefined>;
  getStockAdjustmentsByProductId(productId: string): Promise<StockAdjustment[]>;
  createStockAdjustment(stockAdjustment: InsertStockAdjustment): Promise<StockAdjustment>;

  // StockTransfers
  getStockTransfers(): Promise<StockTransfer[]>;
  getStockTransfer(id: string): Promise<StockTransfer | undefined>;
  getStockTransfersByProductId(productId: string): Promise<StockTransfer[]>;
  createStockTransfer(stockTransfer: InsertStockTransfer): Promise<StockTransfer>;
  updateStockTransfer(id: string, stockTransfer: Partial<InsertStockTransfer>): Promise<StockTransfer | undefined>;

  // PurchaseOrders
  getPurchaseOrders(): Promise<PurchaseOrder[]>;
  getPurchaseOrder(id: string): Promise<PurchaseOrder | undefined>;
  createPurchaseOrder(purchaseOrder: InsertPurchaseOrder): Promise<PurchaseOrder>;
  updatePurchaseOrder(id: string, purchaseOrder: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder | undefined>;

  // PurchaseOrderItems
  getPurchaseOrderItems(purchaseOrderId: string): Promise<PurchaseOrderItem[]>;
  createPurchaseOrderItem(purchaseOrderItem: InsertPurchaseOrderItem): Promise<PurchaseOrderItem>;

  // SalesReturns
  getSalesReturns(): Promise<SalesReturn[]>;
  getSalesReturn(id: string): Promise<SalesReturn | undefined>;
  createSalesReturn(salesReturn: InsertSalesReturn): Promise<SalesReturn>;

  // SalesReturnItems
  getSalesReturnItems(salesReturnId: string): Promise<SalesReturnItem[]>;
  createSalesReturnItem(salesReturnItem: InsertSalesReturnItem): Promise<SalesReturnItem>;

  // PurchaseReturns
  getPurchaseReturns(): Promise<PurchaseReturn[]>;
  getPurchaseReturn(id: string): Promise<PurchaseReturn | undefined>;
  createPurchaseReturn(purchaseReturn: InsertPurchaseReturn): Promise<PurchaseReturn>;

  // PurchaseReturnItems
  getPurchaseReturnItems(purchaseReturnId: string): Promise<PurchaseReturnItem[]>;
  createPurchaseReturnItem(purchaseReturnItem: InsertPurchaseReturnItem): Promise<PurchaseReturnItem>;

  // Dashboard Stats
  getDashboardStats(): Promise<{
    totalSales: string;
    totalPurchases: string;
    totalProfit: string;
    totalExpenses: string;
    totalCustomers: number;
    totalSuppliers: number;
    totalProducts: number;
    totalOrders: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private categories: Map<string, Category> = new Map();
  private subCategories: Map<string, SubCategory> = new Map();
  private brands: Map<string, Brand> = new Map();
  private units: Map<string, Unit> = new Map();
  private variantAttributes: Map<string, VariantAttribute> = new Map();
  private warranties: Map<string, Warranty> = new Map();
  private products: Map<string, Product> = new Map();
  private customers: Map<string, Customer> = new Map();
  private suppliers: Map<string, Supplier> = new Map();
  private sales: Map<string, Sale> = new Map();
  private saleItems: Map<string, SaleItem[]> = new Map();
  private purchases: Map<string, Purchase> = new Map();
  private purchaseItems: Map<string, PurchaseItem[]> = new Map();
  private expenses: Map<string, Expense> = new Map();
  private stockAdjustments: Map<string, StockAdjustment> = new Map();
  private stockTransfers: Map<string, StockTransfer> = new Map();
  private purchaseOrders: Map<string, PurchaseOrder> = new Map();
  private purchaseOrderItems: Map<string, PurchaseOrderItem[]> = new Map();
  private salesReturns: Map<string, SalesReturn> = new Map();
  private salesReturnItems: Map<string, SalesReturnItem[]> = new Map();
  private purchaseReturns: Map<string, PurchaseReturn> = new Map();
  private purchaseReturnItems: Map<string, PurchaseReturnItem[]> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample categories
    const electronicsCategory: Category = {
      id: "cat-1",
      name: "Electronics",
      description: "Electronic devices and accessories",
      createdAt: new Date(),
    };
    this.categories.set(electronicsCategory.id, electronicsCategory);

    const fashionCategory: Category = {
      id: "cat-2", 
      name: "Fashion",
      description: "Clothing and accessories",
      createdAt: new Date(),
    };
    this.categories.set(fashionCategory.id, fashionCategory);

    const sportsCategory: Category = {
      id: "cat-3",
      name: "Sports",
      description: "Sports equipment and accessories", 
      createdAt: new Date(),
    };
    this.categories.set(sportsCategory.id, sportsCategory);

    // Initialize with sample customers
    const customers = [
      {
        id: "cust-1",
        name: "Andrea Willer",
        email: "andrea@example.com",
        phone: "+1234567890",
        address: "123 Main St",
        city: "New York",
        country: "USA",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        totalOrders: 24,
        totalSpent: "8964500",
        createdAt: new Date(),
      },
      {
        id: "cust-2", 
        name: "Timothy Sanders",
        email: "timothy@example.com",
        phone: "+1234567891",
        address: "456 Oak Ave",
        city: "Dubai", 
        country: "UAE",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        totalOrders: 22,
        totalSpent: "16985000",
        createdAt: new Date(),
      }
    ];

    customers.forEach(customer => this.customers.set(customer.id, customer));

    // Initialize with sample suppliers
    const suppliers = [
      {
        id: "sup-1",
        name: "Electro Mart",
        contactPerson: "John Smith",
        email: "contact@electromart.com",
        phone: "+1234567892",
        address: "789 Electronics Blvd",
        city: "San Francisco",
        country: "USA",
        createdAt: new Date(),
      }
    ];

    suppliers.forEach(supplier => this.suppliers.set(supplier.id, supplier));

    // Initialize with sample brands
    const brands = [
      {
        id: "brand-1",
        name: "Apple",
        description: "Premium consumer electronics",
        logoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "brand-2",
        name: "Samsung",
        description: "Global electronics brand",
        logoUrl: null,
        createdAt: new Date(),
      },
      {
        id: "brand-3",
        name: "Nike",
        description: "Sports and athletic apparel",
        logoUrl: null,
        createdAt: new Date(),
      }
    ];

    brands.forEach(brand => this.brands.set(brand.id, brand));

    // Initialize with sample units
    const units = [
      {
        id: "unit-1",
        name: "Piece",
        shortName: "pcs",
        createdAt: new Date(),
      },
      {
        id: "unit-2",
        name: "Kilogram",
        shortName: "kg",
        createdAt: new Date(),
      },
      {
        id: "unit-3",
        name: "Liter",
        shortName: "l",
        createdAt: new Date(),
      }
    ];

    units.forEach(unit => this.units.set(unit.id, unit));

    // Initialize with sample warranties
    const warranties = [
      {
        id: "warranty-1",
        name: "1 Year Warranty",
        duration: 12,
        durationType: "months",
        description: "Standard 1 year manufacturer warranty",
        createdAt: new Date(),
      },
      {
        id: "warranty-2",
        name: "6 Month Warranty",
        duration: 6,
        durationType: "months",
        description: "Limited 6 month warranty",
        createdAt: new Date(),
      }
    ];

    warranties.forEach(warranty => this.warranties.set(warranty.id, warranty));

    // Initialize with sample sub-categories
    const subCategoriesData = [
      {
        id: "subcat-1",
        name: "Smartphones",
        categoryId: "cat-1",
        description: "Mobile phones and smartphones",
        createdAt: new Date(),
      },
      {
        id: "subcat-2",
        name: "Laptops",
        categoryId: "cat-1",
        description: "Portable computers",
        createdAt: new Date(),
      }
    ];

    subCategoriesData.forEach(subCat => this.subCategories.set(subCat.id, subCat));

    // Initialize with sample products
    const sampleProducts = [
      {
        id: "prod-1",
        name: "iPhone 14 Pro",
        description: "Latest Apple smartphone with A16 Bionic chip",
        categoryId: "cat-1",
        subCategoryId: "subcat-1",
        brandId: "brand-1",
        unitId: "unit-1",
        warrantyId: "warranty-1",
        sku: "IPH14PRO-128",
        barcode: "1234567890123",
        cost: "850.00",
        price: "1099.00",
        stock: 25,
        minStock: 10,
        expiryDate: null,
        imageUrl: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "prod-2",
        name: "Samsung Galaxy S23",
        description: "Premium Android smartphone",
        categoryId: "cat-1",
        subCategoryId: "subcat-1",
        brandId: "brand-2",
        unitId: "unit-1",
        warrantyId: "warranty-1",
        sku: "SAM-S23-256",
        barcode: "1234567890124",
        cost: "750.00",
        price: "999.00",
        stock: 5,
        minStock: 10,
        expiryDate: null,
        imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "prod-3",
        name: "MacBook Pro 14",
        description: "Professional laptop with M2 Pro chip",
        categoryId: "cat-1",
        subCategoryId: "subcat-2",
        brandId: "brand-1",
        unitId: "unit-1",
        warrantyId: "warranty-1",
        sku: "MBP14-M2-512",
        barcode: "1234567890125",
        cost: "1800.00",
        price: "2399.00",
        stock: 8,
        minStock: 5,
        expiryDate: null,
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "prod-4",
        name: "Nike Air Max 270",
        description: "Comfortable running shoes",
        categoryId: "cat-3",
        subCategoryId: null,
        brandId: "brand-3",
        unitId: "unit-1",
        warrantyId: "warranty-2",
        sku: "NIKE-AM270-BLK",
        barcode: "1234567890126",
        cost: "80.00",
        price: "150.00",
        stock: 3,
        minStock: 15,
        expiryDate: null,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "prod-5",
        name: "Wireless Earbuds Pro",
        description: "Premium wireless earbuds with ANC",
        categoryId: "cat-1",
        subCategoryId: null,
        brandId: "brand-2",
        unitId: "unit-1",
        warrantyId: "warranty-1",
        sku: "EARBUDS-PRO-WHT",
        barcode: "1234567890127",
        cost: "120.00",
        price: "199.00",
        stock: 45,
        minStock: 20,
        expiryDate: null,
        imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "prod-6",
        name: "Protein Bar - Chocolate",
        description: "High protein energy bar",
        categoryId: "cat-2",
        subCategoryId: null,
        brandId: null,
        unitId: "unit-1",
        warrantyId: null,
        sku: "PROTEIN-CHOC-24",
        barcode: "1234567890128",
        cost: "1.50",
        price: "2.99",
        stock: 120,
        minStock: 50,
        expiryDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        imageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "prod-7",
        name: "Smart Watch Series 5",
        description: "Fitness tracker with heart rate monitor",
        categoryId: "cat-1",
        subCategoryId: null,
        brandId: "brand-1",
        unitId: "unit-1",
        warrantyId: "warranty-1",
        sku: "WATCH-S5-BLK",
        barcode: "1234567890129",
        cost: "280.00",
        price: "399.00",
        stock: 2,
        minStock: 8,
        expiryDate: null,
        imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "prod-8",
        name: "Vitamin C Supplement",
        description: "1000mg vitamin C tablets, 90 count",
        categoryId: "cat-2",
        subCategoryId: null,
        brandId: null,
        unitId: "unit-1",
        warrantyId: null,
        sku: "VITC-1000-90",
        barcode: "1234567890130",
        cost: "8.00",
        price: "14.99",
        stock: 30,
        minStock: 25,
        expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "prod-9",
        name: "USB-C Cable 2m",
        description: "Fast charging USB-C to USB-C cable",
        categoryId: "cat-1",
        subCategoryId: null,
        brandId: null,
        unitId: "unit-1",
        warrantyId: "warranty-2",
        sku: "CABLE-USBC-2M",
        barcode: "1234567890131",
        cost: "5.00",
        price: "12.99",
        stock: 150,
        minStock: 50,
        expiryDate: null,
        imageUrl: "https://images.unsplash.com/photo-1585859962449-d29f1b77e8fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "prod-10",
        name: "Gaming Mouse RGB",
        description: "High precision gaming mouse with RGB lighting",
        categoryId: "cat-1",
        subCategoryId: null,
        brandId: null,
        unitId: "unit-1",
        warrantyId: "warranty-1",
        sku: "MOUSE-RGB-PRO",
        barcode: "1234567890132",
        cost: "35.00",
        price: "69.99",
        stock: 1,
        minStock: 10,
        expiryDate: null,
        imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        isActive: true,
        createdAt: new Date(),
      }
    ];

    sampleProducts.forEach(product => this.products.set(product.id, product));

    // Initialize with sample sales
    const sampleSales = [
      {
        id: "446d1fdd-55ec-49ca-ac22-715b041306aa",
        customerId: "cust-1",
        subtotal: "1099.00",
        tax: "109.90",
        discount: "0",
        total: "1208.90",
        status: "completed",
        paymentMethod: "card",
        notes: "Walk-in customer",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: "sale-2",
        customerId: "cust-2",
        subtotal: "2399.00",
        tax: "239.90",
        discount: "100.00",
        total: "2538.90",
        status: "completed",
        paymentMethod: "cash",
        notes: "Regular customer",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "sale-3",
        customerId: "cust-1",
        subtotal: "399.00",
        tax: "39.90",
        discount: "0",
        total: "438.90",
        status: "completed",
        paymentMethod: "card",
        notes: null,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }
    ];

    sampleSales.forEach(sale => this.sales.set(sale.id, sale));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "admin",
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { 
      ...insertCategory, 
      description: insertCategory.description || null,
      id, 
      createdAt: new Date() 
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updated = { ...category, ...updateData };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategoryId(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.categoryId === categoryId);
  }

  async getLowStockProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.stock <= product.minStock);
  }

  async getExpiredProducts(): Promise<Product[]> {
    const now = new Date();
    return Array.from(this.products.values()).filter(product => 
      product.expiryDate && new Date(product.expiryDate) < now
    );
  }

  async getTopSellingProducts(limit: number = 10): Promise<Product[]> {
    // For demo purposes, return products sorted by stock (assuming higher stock means more sales)
    return Array.from(this.products.values())
      .sort((a, b) => parseInt(b.stock.toString()) - parseInt(a.stock.toString()))
      .slice(0, limit);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct,
      description: insertProduct.description || null,
      subCategoryId: insertProduct.subCategoryId || null,
      brandId: insertProduct.brandId || null,
      unitId: insertProduct.unitId || null,
      warrantyId: insertProduct.warrantyId || null,
      barcode: insertProduct.barcode || null,
      expiryDate: insertProduct.expiryDate || null,
      imageUrl: insertProduct.imageUrl || null,
      stock: insertProduct.stock || 0,
      minStock: insertProduct.minStock || 10,
      isActive: insertProduct.isActive !== undefined ? insertProduct.isActive : true,
      id, 
      createdAt: new Date() 
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updated = { ...product, ...updateData };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getTopCustomers(limit: number = 10): Promise<Customer[]> {
    return Array.from(this.customers.values())
      .sort((a, b) => parseFloat(b.totalSpent || "0") - parseFloat(a.totalSpent || "0"))
      .slice(0, limit);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = { 
      ...insertCustomer,
      email: insertCustomer.email || null,
      phone: insertCustomer.phone || null,
      address: insertCustomer.address || null,
      city: insertCustomer.city || null,
      country: insertCustomer.country || null,
      avatarUrl: insertCustomer.avatarUrl || null,
      id, 
      totalOrders: 0,
      totalSpent: "0",
      createdAt: new Date() 
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, updateData: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    
    const updated = { ...customer, ...updateData };
    this.customers.set(id, updated);
    return updated;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    return this.customers.delete(id);
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const supplier: Supplier = { 
      ...insertSupplier,
      contactPerson: insertSupplier.contactPerson || null,
      email: insertSupplier.email || null,
      phone: insertSupplier.phone || null,
      address: insertSupplier.address || null,
      city: insertSupplier.city || null,
      country: insertSupplier.country || null,
      id, 
      createdAt: new Date() 
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: string, updateData: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;
    
    const updated = { ...supplier, ...updateData };
    this.suppliers.set(id, updated);
    return updated;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    return this.suppliers.delete(id);
  }

  // Sales
  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async getSale(id: string): Promise<Sale | undefined> {
    return this.sales.get(id);
  }

  async getRecentSales(limit: number = 10): Promise<Sale[]> {
    return Array.from(this.sales.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, limit);
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = randomUUID();
    const sale: Sale = { 
      ...insertSale,
      customerId: insertSale.customerId || null,
      tax: insertSale.tax || "0",
      discount: insertSale.discount || "0",
      notes: insertSale.notes || null,
      status: insertSale.status || "completed",
      id, 
      createdAt: new Date() 
    };
    this.sales.set(id, sale);
    return sale;
  }

  async updateSale(id: string, updateData: Partial<InsertSale>): Promise<Sale | undefined> {
    const sale = this.sales.get(id);
    if (!sale) return undefined;
    
    const updated = { ...sale, ...updateData };
    this.sales.set(id, updated);
    return updated;
  }

  // Sale Items
  async getSaleItems(saleId: string): Promise<SaleItem[]> {
    return this.saleItems.get(saleId) || [];
  }

  async createSaleItem(insertSaleItem: InsertSaleItem): Promise<SaleItem> {
    const id = randomUUID();
    const saleItem: SaleItem = { ...insertSaleItem, id };
    
    const items = this.saleItems.get(insertSaleItem.saleId) || [];
    items.push(saleItem);
    this.saleItems.set(insertSaleItem.saleId, items);
    
    return saleItem;
  }

  // Purchases
  async getPurchases(): Promise<Purchase[]> {
    return Array.from(this.purchases.values());
  }

  async getPurchase(id: string): Promise<Purchase | undefined> {
    return this.purchases.get(id);
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const id = randomUUID();
    const purchase: Purchase = { 
      ...insertPurchase,
      supplierId: insertPurchase.supplierId || null,
      tax: insertPurchase.tax || "0",
      notes: insertPurchase.notes || null,
      status: insertPurchase.status || "completed",
      id, 
      createdAt: new Date() 
    };
    this.purchases.set(id, purchase);
    return purchase;
  }

  async updatePurchase(id: string, updateData: Partial<InsertPurchase>): Promise<Purchase | undefined> {
    const purchase = this.purchases.get(id);
    if (!purchase) return undefined;
    
    const updated = { ...purchase, ...updateData };
    this.purchases.set(id, updated);
    return updated;
  }

  // Purchase Items
  async getPurchaseItems(purchaseId: string): Promise<PurchaseItem[]> {
    return this.purchaseItems.get(purchaseId) || [];
  }

  async createPurchaseItem(insertPurchaseItem: InsertPurchaseItem): Promise<PurchaseItem> {
    const id = randomUUID();
    const purchaseItem: PurchaseItem = { ...insertPurchaseItem, id };
    
    const items = this.purchaseItems.get(insertPurchaseItem.purchaseId) || [];
    items.push(purchaseItem);
    this.purchaseItems.set(insertPurchaseItem.purchaseId, items);
    
    return purchaseItem;
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async getExpense(id: string): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = randomUUID();
    const expense: Expense = { 
      ...insertExpense,
      description: insertExpense.description || null,
      status: insertExpense.status || "approved",
      id, 
      createdAt: new Date() 
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async updateExpense(id: string, updateData: Partial<InsertExpense>): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;
    
    const updated = { ...expense, ...updateData };
    this.expenses.set(id, updated);
    return updated;
  }

  async deleteExpense(id: string): Promise<boolean> {
    return this.expenses.delete(id);
  }

  // SubCategories
  async getSubCategories(): Promise<SubCategory[]> {
    return Array.from(this.subCategories.values());
  }

  async getSubCategory(id: string): Promise<SubCategory | undefined> {
    return this.subCategories.get(id);
  }

  async getSubCategoriesByCategoryId(categoryId: string): Promise<SubCategory[]> {
    return Array.from(this.subCategories.values()).filter(subCat => subCat.categoryId === categoryId);
  }

  async createSubCategory(insertSubCategory: InsertSubCategory): Promise<SubCategory> {
    const id = randomUUID();
    const subCategory: SubCategory = {
      ...insertSubCategory,
      description: insertSubCategory.description || null,
      id,
      createdAt: new Date()
    };
    this.subCategories.set(id, subCategory);
    return subCategory;
  }

  async updateSubCategory(id: string, updateData: Partial<InsertSubCategory>): Promise<SubCategory | undefined> {
    const subCategory = this.subCategories.get(id);
    if (!subCategory) return undefined;
    
    const updated = { ...subCategory, ...updateData };
    this.subCategories.set(id, updated);
    return updated;
  }

  async deleteSubCategory(id: string): Promise<boolean> {
    return this.subCategories.delete(id);
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = randomUUID();
    const brand: Brand = {
      ...insertBrand,
      description: insertBrand.description || null,
      logoUrl: insertBrand.logoUrl || null,
      id,
      createdAt: new Date()
    };
    this.brands.set(id, brand);
    return brand;
  }

  async updateBrand(id: string, updateData: Partial<InsertBrand>): Promise<Brand | undefined> {
    const brand = this.brands.get(id);
    if (!brand) return undefined;
    
    const updated = { ...brand, ...updateData };
    this.brands.set(id, updated);
    return updated;
  }

  async deleteBrand(id: string): Promise<boolean> {
    return this.brands.delete(id);
  }

  // Units
  async getUnits(): Promise<Unit[]> {
    return Array.from(this.units.values());
  }

  async getUnit(id: string): Promise<Unit | undefined> {
    return this.units.get(id);
  }

  async createUnit(insertUnit: InsertUnit): Promise<Unit> {
    const id = randomUUID();
    const unit: Unit = {
      ...insertUnit,
      id,
      createdAt: new Date()
    };
    this.units.set(id, unit);
    return unit;
  }

  async updateUnit(id: string, updateData: Partial<InsertUnit>): Promise<Unit | undefined> {
    const unit = this.units.get(id);
    if (!unit) return undefined;
    
    const updated = { ...unit, ...updateData };
    this.units.set(id, updated);
    return updated;
  }

  async deleteUnit(id: string): Promise<boolean> {
    return this.units.delete(id);
  }

  // VariantAttributes
  async getVariantAttributes(): Promise<VariantAttribute[]> {
    return Array.from(this.variantAttributes.values());
  }

  async getVariantAttribute(id: string): Promise<VariantAttribute | undefined> {
    return this.variantAttributes.get(id);
  }

  async createVariantAttribute(insertVariantAttribute: InsertVariantAttribute): Promise<VariantAttribute> {
    const id = randomUUID();
    const variantAttribute: VariantAttribute = {
      ...insertVariantAttribute,
      values: insertVariantAttribute.values || null,
      id,
      createdAt: new Date()
    };
    this.variantAttributes.set(id, variantAttribute);
    return variantAttribute;
  }

  async updateVariantAttribute(id: string, updateData: Partial<InsertVariantAttribute>): Promise<VariantAttribute | undefined> {
    const variantAttribute = this.variantAttributes.get(id);
    if (!variantAttribute) return undefined;
    
    const updated = { ...variantAttribute, ...updateData };
    this.variantAttributes.set(id, updated);
    return updated;
  }

  async deleteVariantAttribute(id: string): Promise<boolean> {
    return this.variantAttributes.delete(id);
  }

  // Warranties
  async getWarranties(): Promise<Warranty[]> {
    return Array.from(this.warranties.values());
  }

  async getWarranty(id: string): Promise<Warranty | undefined> {
    return this.warranties.get(id);
  }

  async createWarranty(insertWarranty: InsertWarranty): Promise<Warranty> {
    const id = randomUUID();
    const warranty: Warranty = {
      ...insertWarranty,
      description: insertWarranty.description || null,
      id,
      createdAt: new Date()
    };
    this.warranties.set(id, warranty);
    return warranty;
  }

  async updateWarranty(id: string, updateData: Partial<InsertWarranty>): Promise<Warranty | undefined> {
    const warranty = this.warranties.get(id);
    if (!warranty) return undefined;
    
    const updated = { ...warranty, ...updateData };
    this.warranties.set(id, updated);
    return updated;
  }

  async deleteWarranty(id: string): Promise<boolean> {
    return this.warranties.delete(id);
  }

  // StockAdjustments
  async getStockAdjustments(): Promise<StockAdjustment[]> {
    return Array.from(this.stockAdjustments.values());
  }

  async getStockAdjustment(id: string): Promise<StockAdjustment | undefined> {
    return this.stockAdjustments.get(id);
  }

  async getStockAdjustmentsByProductId(productId: string): Promise<StockAdjustment[]> {
    return Array.from(this.stockAdjustments.values()).filter(adj => adj.productId === productId);
  }

  async createStockAdjustment(insertStockAdjustment: InsertStockAdjustment): Promise<StockAdjustment> {
    const id = randomUUID();
    const stockAdjustment: StockAdjustment = {
      ...insertStockAdjustment,
      notes: insertStockAdjustment.notes || null,
      id,
      createdAt: new Date()
    };
    this.stockAdjustments.set(id, stockAdjustment);
    return stockAdjustment;
  }

  // StockTransfers
  async getStockTransfers(): Promise<StockTransfer[]> {
    return Array.from(this.stockTransfers.values());
  }

  async getStockTransfer(id: string): Promise<StockTransfer | undefined> {
    return this.stockTransfers.get(id);
  }

  async getStockTransfersByProductId(productId: string): Promise<StockTransfer[]> {
    return Array.from(this.stockTransfers.values()).filter(transfer => transfer.productId === productId);
  }

  async createStockTransfer(insertStockTransfer: InsertStockTransfer): Promise<StockTransfer> {
    const id = randomUUID();
    const stockTransfer: StockTransfer = {
      ...insertStockTransfer,
      notes: insertStockTransfer.notes || null,
      status: insertStockTransfer.status || "pending",
      id,
      createdAt: new Date()
    };
    this.stockTransfers.set(id, stockTransfer);
    return stockTransfer;
  }

  async updateStockTransfer(id: string, updateData: Partial<InsertStockTransfer>): Promise<StockTransfer | undefined> {
    const stockTransfer = this.stockTransfers.get(id);
    if (!stockTransfer) return undefined;
    
    const updated = { ...stockTransfer, ...updateData };
    this.stockTransfers.set(id, updated);
    return updated;
  }

  // PurchaseOrders
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return Array.from(this.purchaseOrders.values());
  }

  async getPurchaseOrder(id: string): Promise<PurchaseOrder | undefined> {
    return this.purchaseOrders.get(id);
  }

  async createPurchaseOrder(insertPurchaseOrder: InsertPurchaseOrder): Promise<PurchaseOrder> {
    const id = randomUUID();
    const purchaseOrder: PurchaseOrder = {
      ...insertPurchaseOrder,
      tax: insertPurchaseOrder.tax || "0",
      status: insertPurchaseOrder.status || "pending",
      expectedDate: insertPurchaseOrder.expectedDate || null,
      notes: insertPurchaseOrder.notes || null,
      id,
      createdAt: new Date()
    };
    this.purchaseOrders.set(id, purchaseOrder);
    return purchaseOrder;
  }

  async updatePurchaseOrder(id: string, updateData: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder | undefined> {
    const purchaseOrder = this.purchaseOrders.get(id);
    if (!purchaseOrder) return undefined;
    
    const updated = { ...purchaseOrder, ...updateData };
    this.purchaseOrders.set(id, updated);
    return updated;
  }

  // PurchaseOrderItems
  async getPurchaseOrderItems(purchaseOrderId: string): Promise<PurchaseOrderItem[]> {
    return this.purchaseOrderItems.get(purchaseOrderId) || [];
  }

  async createPurchaseOrderItem(insertPurchaseOrderItem: InsertPurchaseOrderItem): Promise<PurchaseOrderItem> {
    const id = randomUUID();
    const purchaseOrderItem: PurchaseOrderItem = { ...insertPurchaseOrderItem, id };
    
    const items = this.purchaseOrderItems.get(insertPurchaseOrderItem.purchaseOrderId) || [];
    items.push(purchaseOrderItem);
    this.purchaseOrderItems.set(insertPurchaseOrderItem.purchaseOrderId, items);
    
    return purchaseOrderItem;
  }

  // SalesReturns
  async getSalesReturns(): Promise<SalesReturn[]> {
    return Array.from(this.salesReturns.values());
  }

  async getSalesReturn(id: string): Promise<SalesReturn | undefined> {
    return this.salesReturns.get(id);
  }

  async createSalesReturn(insertSalesReturn: InsertSalesReturn): Promise<SalesReturn> {
    const id = randomUUID();
    const salesReturn: SalesReturn = {
      ...insertSalesReturn,
      customerId: insertSalesReturn.customerId || null,
      tax: insertSalesReturn.tax || "0",
      reason: insertSalesReturn.reason || null,
      notes: insertSalesReturn.notes || null,
      id,
      createdAt: new Date()
    };
    this.salesReturns.set(id, salesReturn);
    return salesReturn;
  }

  // SalesReturnItems
  async getSalesReturnItems(salesReturnId: string): Promise<SalesReturnItem[]> {
    return this.salesReturnItems.get(salesReturnId) || [];
  }

  async createSalesReturnItem(insertSalesReturnItem: InsertSalesReturnItem): Promise<SalesReturnItem> {
    const id = randomUUID();
    const salesReturnItem: SalesReturnItem = { ...insertSalesReturnItem, id };
    
    const items = this.salesReturnItems.get(insertSalesReturnItem.salesReturnId) || [];
    items.push(salesReturnItem);
    this.salesReturnItems.set(insertSalesReturnItem.salesReturnId, items);
    
    return salesReturnItem;
  }

  // PurchaseReturns
  async getPurchaseReturns(): Promise<PurchaseReturn[]> {
    return Array.from(this.purchaseReturns.values());
  }

  async getPurchaseReturn(id: string): Promise<PurchaseReturn | undefined> {
    return this.purchaseReturns.get(id);
  }

  async createPurchaseReturn(insertPurchaseReturn: InsertPurchaseReturn): Promise<PurchaseReturn> {
    const id = randomUUID();
    const purchaseReturn: PurchaseReturn = {
      ...insertPurchaseReturn,
      supplierId: insertPurchaseReturn.supplierId || null,
      tax: insertPurchaseReturn.tax || "0",
      reason: insertPurchaseReturn.reason || null,
      notes: insertPurchaseReturn.notes || null,
      id,
      createdAt: new Date()
    };
    this.purchaseReturns.set(id, purchaseReturn);
    return purchaseReturn;
  }

  // PurchaseReturnItems
  async getPurchaseReturnItems(purchaseReturnId: string): Promise<PurchaseReturnItem[]> {
    return this.purchaseReturnItems.get(purchaseReturnId) || [];
  }

  async createPurchaseReturnItem(insertPurchaseReturnItem: InsertPurchaseReturnItem): Promise<PurchaseReturnItem> {
    const id = randomUUID();
    const purchaseReturnItem: PurchaseReturnItem = { ...insertPurchaseReturnItem, id };
    
    const items = this.purchaseReturnItems.get(insertPurchaseReturnItem.purchaseReturnId) || [];
    items.push(purchaseReturnItem);
    this.purchaseReturnItems.set(insertPurchaseReturnItem.purchaseReturnId, items);
    
    return purchaseReturnItem;
  }

  // Dashboard Stats
  async getDashboardStats() {
    const totalSales = Array.from(this.sales.values())
      .reduce((sum, sale) => sum + parseFloat(sale.total), 0);
    
    const totalPurchases = Array.from(this.purchases.values())
      .reduce((sum, purchase) => sum + parseFloat(purchase.total), 0);
    
    const totalExpenses = Array.from(this.expenses.values())
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    
    return {
      totalSales: totalSales.toFixed(2),
      totalPurchases: totalPurchases.toFixed(2),
      totalProfit: (totalSales - totalPurchases - totalExpenses).toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      totalCustomers: this.customers.size,
      totalSuppliers: this.suppliers.size,
      totalProducts: this.products.size,
      totalOrders: this.sales.size,
    };
  }
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return result[0];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductsByCategoryId(categoryId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async getLowStockProducts(): Promise<Product[]> {
    return await db.select().from(products).where(lte(products.stock, products.minStock));
  }

  async getTopSellingProducts(limit: number = 10): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.stock)).limit(limit);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getExpiredProducts(): Promise<Product[]> {
    const now = new Date();
    return await db.select().from(products).where(sql`${products.expiryDate} < ${now}`);
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.id, id));
    return result[0];
  }

  async getTopCustomers(limit: number = 10): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(desc(customers.totalSpent)).limit(limit);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const result = await db.insert(customers).values(customer).returning();
    return result[0];
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const result = await db.update(customers).set(customer).where(eq(customers.id, id)).returning();
    return result[0];
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const result = await db.delete(customers).where(eq(customers.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers);
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    const result = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return result[0];
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const result = await db.insert(suppliers).values(supplier).returning();
    return result[0];
  }

  async updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const result = await db.update(suppliers).set(supplier).where(eq(suppliers.id, id)).returning();
    return result[0];
  }

  async deleteSupplier(id: string): Promise<boolean> {
    const result = await db.delete(suppliers).where(eq(suppliers.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Sales
  async getSales(): Promise<Sale[]> {
    return await db.select().from(sales);
  }

  async getSale(id: string): Promise<Sale | undefined> {
    const result = await db.select().from(sales).where(eq(sales.id, id));
    return result[0];
  }

  async getRecentSales(limit: number = 10): Promise<Sale[]> {
    return await db.select().from(sales).orderBy(desc(sales.createdAt)).limit(limit);
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    const result = await db.insert(sales).values(sale).returning();
    return result[0];
  }

  async updateSale(id: string, sale: Partial<InsertSale>): Promise<Sale | undefined> {
    const result = await db.update(sales).set(sale).where(eq(sales.id, id)).returning();
    return result[0];
  }

  // Sale Items
  async getSaleItems(saleId: string): Promise<SaleItem[]> {
    return await db.select().from(saleItems).where(eq(saleItems.saleId, saleId));
  }

  async createSaleItem(saleItem: InsertSaleItem): Promise<SaleItem> {
    const result = await db.insert(saleItems).values(saleItem).returning();
    return result[0];
  }

  // Purchases
  async getPurchases(): Promise<Purchase[]> {
    return await db.select().from(purchases);
  }

  async getPurchase(id: string): Promise<Purchase | undefined> {
    const result = await db.select().from(purchases).where(eq(purchases.id, id));
    return result[0];
  }

  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const result = await db.insert(purchases).values(purchase).returning();
    return result[0];
  }

  async updatePurchase(id: string, purchase: Partial<InsertPurchase>): Promise<Purchase | undefined> {
    const result = await db.update(purchases).set(purchase).where(eq(purchases.id, id)).returning();
    return result[0];
  }

  // Purchase Items
  async getPurchaseItems(purchaseId: string): Promise<PurchaseItem[]> {
    return await db.select().from(purchaseItems).where(eq(purchaseItems.purchaseId, purchaseId));
  }

  async createPurchaseItem(purchaseItem: InsertPurchaseItem): Promise<PurchaseItem> {
    const result = await db.insert(purchaseItems).values(purchaseItem).returning();
    return result[0];
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return await db.select().from(expenses);
  }

  async getExpense(id: string): Promise<Expense | undefined> {
    const result = await db.select().from(expenses).where(eq(expenses.id, id));
    return result[0];
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const result = await db.insert(expenses).values(expense).returning();
    return result[0];
  }

  async updateExpense(id: string, expense: Partial<InsertExpense>): Promise<Expense | undefined> {
    const result = await db.update(expenses).set(expense).where(eq(expenses.id, id)).returning();
    return result[0];
  }

  async deleteExpense(id: string): Promise<boolean> {
    const result = await db.delete(expenses).where(eq(expenses.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // SubCategories
  async getSubCategories(): Promise<SubCategory[]> {
    return await db.select().from(subCategories);
  }

  async getSubCategory(id: string): Promise<SubCategory | undefined> {
    const result = await db.select().from(subCategories).where(eq(subCategories.id, id));
    return result[0];
  }

  async getSubCategoriesByCategoryId(categoryId: string): Promise<SubCategory[]> {
    return await db.select().from(subCategories).where(eq(subCategories.categoryId, categoryId));
  }

  async createSubCategory(subCategory: InsertSubCategory): Promise<SubCategory> {
    const result = await db.insert(subCategories).values(subCategory).returning();
    return result[0];
  }

  async updateSubCategory(id: string, subCategory: Partial<InsertSubCategory>): Promise<SubCategory | undefined> {
    const result = await db.update(subCategories).set(subCategory).where(eq(subCategories.id, id)).returning();
    return result[0];
  }

  async deleteSubCategory(id: string): Promise<boolean> {
    const result = await db.delete(subCategories).where(eq(subCategories.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    return await db.select().from(brands);
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    const result = await db.select().from(brands).where(eq(brands.id, id));
    return result[0];
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const result = await db.insert(brands).values(brand).returning();
    return result[0];
  }

  async updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand | undefined> {
    const result = await db.update(brands).set(brand).where(eq(brands.id, id)).returning();
    return result[0];
  }

  async deleteBrand(id: string): Promise<boolean> {
    const result = await db.delete(brands).where(eq(brands.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Units
  async getUnits(): Promise<Unit[]> {
    return await db.select().from(units);
  }

  async getUnit(id: string): Promise<Unit | undefined> {
    const result = await db.select().from(units).where(eq(units.id, id));
    return result[0];
  }

  async createUnit(unit: InsertUnit): Promise<Unit> {
    const result = await db.insert(units).values(unit).returning();
    return result[0];
  }

  async updateUnit(id: string, unit: Partial<InsertUnit>): Promise<Unit | undefined> {
    const result = await db.update(units).set(unit).where(eq(units.id, id)).returning();
    return result[0];
  }

  async deleteUnit(id: string): Promise<boolean> {
    const result = await db.delete(units).where(eq(units.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // VariantAttributes
  async getVariantAttributes(): Promise<VariantAttribute[]> {
    return await db.select().from(variantAttributes);
  }

  async getVariantAttribute(id: string): Promise<VariantAttribute | undefined> {
    const result = await db.select().from(variantAttributes).where(eq(variantAttributes.id, id));
    return result[0];
  }

  async createVariantAttribute(variantAttribute: InsertVariantAttribute): Promise<VariantAttribute> {
    const result = await db.insert(variantAttributes).values(variantAttribute).returning();
    return result[0];
  }

  async updateVariantAttribute(id: string, variantAttribute: Partial<InsertVariantAttribute>): Promise<VariantAttribute | undefined> {
    const result = await db.update(variantAttributes).set(variantAttribute).where(eq(variantAttributes.id, id)).returning();
    return result[0];
  }

  async deleteVariantAttribute(id: string): Promise<boolean> {
    const result = await db.delete(variantAttributes).where(eq(variantAttributes.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Warranties
  async getWarranties(): Promise<Warranty[]> {
    return await db.select().from(warranties);
  }

  async getWarranty(id: string): Promise<Warranty | undefined> {
    const result = await db.select().from(warranties).where(eq(warranties.id, id));
    return result[0];
  }

  async createWarranty(warranty: InsertWarranty): Promise<Warranty> {
    const result = await db.insert(warranties).values(warranty).returning();
    return result[0];
  }

  async updateWarranty(id: string, warranty: Partial<InsertWarranty>): Promise<Warranty | undefined> {
    const result = await db.update(warranties).set(warranty).where(eq(warranties.id, id)).returning();
    return result[0];
  }

  async deleteWarranty(id: string): Promise<boolean> {
    const result = await db.delete(warranties).where(eq(warranties.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // StockAdjustments
  async getStockAdjustments(): Promise<StockAdjustment[]> {
    return await db.select().from(stockAdjustments);
  }

  async getStockAdjustment(id: string): Promise<StockAdjustment | undefined> {
    const result = await db.select().from(stockAdjustments).where(eq(stockAdjustments.id, id));
    return result[0];
  }

  async getStockAdjustmentsByProductId(productId: string): Promise<StockAdjustment[]> {
    return await db.select().from(stockAdjustments).where(eq(stockAdjustments.productId, productId));
  }

  async createStockAdjustment(stockAdjustment: InsertStockAdjustment): Promise<StockAdjustment> {
    const result = await db.insert(stockAdjustments).values(stockAdjustment).returning();
    return result[0];
  }

  // StockTransfers
  async getStockTransfers(): Promise<StockTransfer[]> {
    return await db.select().from(stockTransfers);
  }

  async getStockTransfer(id: string): Promise<StockTransfer | undefined> {
    const result = await db.select().from(stockTransfers).where(eq(stockTransfers.id, id));
    return result[0];
  }

  async getStockTransfersByProductId(productId: string): Promise<StockTransfer[]> {
    return await db.select().from(stockTransfers).where(eq(stockTransfers.productId, productId));
  }

  async createStockTransfer(stockTransfer: InsertStockTransfer): Promise<StockTransfer> {
    const result = await db.insert(stockTransfers).values(stockTransfer).returning();
    return result[0];
  }

  async updateStockTransfer(id: string, stockTransfer: Partial<InsertStockTransfer>): Promise<StockTransfer | undefined> {
    const result = await db.update(stockTransfers).set(stockTransfer).where(eq(stockTransfers.id, id)).returning();
    return result[0];
  }

  // PurchaseOrders
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return await db.select().from(purchaseOrders);
  }

  async getPurchaseOrder(id: string): Promise<PurchaseOrder | undefined> {
    const result = await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, id));
    return result[0];
  }

  async createPurchaseOrder(purchaseOrder: InsertPurchaseOrder): Promise<PurchaseOrder> {
    const result = await db.insert(purchaseOrders).values(purchaseOrder).returning();
    return result[0];
  }

  async updatePurchaseOrder(id: string, purchaseOrder: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder | undefined> {
    const result = await db.update(purchaseOrders).set(purchaseOrder).where(eq(purchaseOrders.id, id)).returning();
    return result[0];
  }

  // PurchaseOrderItems
  async getPurchaseOrderItems(purchaseOrderId: string): Promise<PurchaseOrderItem[]> {
    return await db.select().from(purchaseOrderItems).where(eq(purchaseOrderItems.purchaseOrderId, purchaseOrderId));
  }

  async createPurchaseOrderItem(purchaseOrderItem: InsertPurchaseOrderItem): Promise<PurchaseOrderItem> {
    const result = await db.insert(purchaseOrderItems).values(purchaseOrderItem).returning();
    return result[0];
  }

  // SalesReturns
  async getSalesReturns(): Promise<SalesReturn[]> {
    return await db.select().from(salesReturns);
  }

  async getSalesReturn(id: string): Promise<SalesReturn | undefined> {
    const result = await db.select().from(salesReturns).where(eq(salesReturns.id, id));
    return result[0];
  }

  async createSalesReturn(salesReturn: InsertSalesReturn): Promise<SalesReturn> {
    const result = await db.insert(salesReturns).values(salesReturn).returning();
    return result[0];
  }

  // SalesReturnItems
  async getSalesReturnItems(salesReturnId: string): Promise<SalesReturnItem[]> {
    return await db.select().from(salesReturnItems).where(eq(salesReturnItems.salesReturnId, salesReturnId));
  }

  async createSalesReturnItem(salesReturnItem: InsertSalesReturnItem): Promise<SalesReturnItem> {
    const result = await db.insert(salesReturnItems).values(salesReturnItem).returning();
    return result[0];
  }

  // PurchaseReturns
  async getPurchaseReturns(): Promise<PurchaseReturn[]> {
    return await db.select().from(purchaseReturns);
  }

  async getPurchaseReturn(id: string): Promise<PurchaseReturn | undefined> {
    const result = await db.select().from(purchaseReturns).where(eq(purchaseReturns.id, id));
    return result[0];
  }

  async createPurchaseReturn(purchaseReturn: InsertPurchaseReturn): Promise<PurchaseReturn> {
    const result = await db.insert(purchaseReturns).values(purchaseReturn).returning();
    return result[0];
  }

  // PurchaseReturnItems
  async getPurchaseReturnItems(purchaseReturnId: string): Promise<PurchaseReturnItem[]> {
    return await db.select().from(purchaseReturnItems).where(eq(purchaseReturnItems.purchaseReturnId, purchaseReturnId));
  }

  async createPurchaseReturnItem(purchaseReturnItem: InsertPurchaseReturnItem): Promise<PurchaseReturnItem> {
    const result = await db.insert(purchaseReturnItems).values(purchaseReturnItem).returning();
    return result[0];
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{
    totalSales: string;
    totalPurchases: string;
    totalProfit: string;
    totalExpenses: string;
    totalCustomers: number;
    totalSuppliers: number;
    totalProducts: number;
    totalOrders: number;
  }> {
    const salesResult = await db.select({
      total: sum(sales.total)
    }).from(sales);
    const totalSales = parseFloat(salesResult[0]?.total || "0");

    const purchasesResult = await db.select({
      total: sum(purchases.total)
    }).from(purchases);
    const totalPurchases = parseFloat(purchasesResult[0]?.total || "0");

    const expensesResult = await db.select({
      total: sum(expenses.amount)
    }).from(expenses);
    const totalExpenses = parseFloat(expensesResult[0]?.total || "0");

    const customersResult = await db.select({
      count: count()
    }).from(customers);
    const totalCustomers = customersResult[0]?.count || 0;

    const suppliersResult = await db.select({
      count: count()
    }).from(suppliers);
    const totalSuppliers = suppliersResult[0]?.count || 0;

    const productsResult = await db.select({
      count: count()
    }).from(products);
    const totalProducts = productsResult[0]?.count || 0;

    const ordersResult = await db.select({
      count: count()
    }).from(sales);
    const totalOrders = ordersResult[0]?.count || 0;

    return {
      totalSales: totalSales.toFixed(2),
      totalPurchases: totalPurchases.toFixed(2),
      totalProfit: (totalSales - totalPurchases - totalExpenses).toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      totalCustomers,
      totalSuppliers,
      totalProducts,
      totalOrders,
    };
  }
}

export const storage = new DbStorage();
