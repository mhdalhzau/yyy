import { 
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type Customer, type InsertCustomer,
  type Supplier, type InsertSupplier,
  type Sale, type InsertSale,
  type SaleItem, type InsertSaleItem,
  type Purchase, type InsertPurchase,
  type PurchaseItem, type InsertPurchaseItem,
  type Expense, type InsertExpense,
  users,
  categories,
  products,
  customers,
  suppliers,
  sales,
  saleItems,
  purchases,
  purchaseItems,
  expenses
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
  private products: Map<string, Product> = new Map();
  private customers: Map<string, Customer> = new Map();
  private suppliers: Map<string, Supplier> = new Map();
  private sales: Map<string, Sale> = new Map();
  private saleItems: Map<string, SaleItem[]> = new Map();
  private purchases: Map<string, Purchase> = new Map();
  private purchaseItems: Map<string, PurchaseItem[]> = new Map();
  private expenses: Map<string, Expense> = new Map();

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
      barcode: insertProduct.barcode || null,
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
