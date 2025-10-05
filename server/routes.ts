import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCategorySchema, insertProductSchema, insertCustomerSchema,
  insertSupplierSchema, insertSaleSchema, insertPurchaseSchema,
  insertExpenseSchema, insertSubCategorySchema, insertBrandSchema,
  insertUnitSchema, insertVariantAttributeSchema, insertWarrantySchema,
  insertStockAdjustmentSchema, insertStockTransferSchema,
  insertPurchaseOrderSchema, insertPurchaseOrderItemSchema,
  insertSalesReturnSchema, insertSalesReturnItemSchema,
  insertPurchaseReturnSchema, insertPurchaseReturnItemSchema,
  insertSaleItemSchema, insertPurchaseItemSchema
} from "@shared/schema";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard Stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Failed to get dashboard stats" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to get category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, categoryData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const success = await storage.deleteCategory(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // SubCategories
  app.get("/api/sub-categories", async (req, res) => {
    try {
      const subCategories = await storage.getSubCategories();
      res.json(subCategories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sub-categories" });
    }
  });

  app.get("/api/sub-categories/:id", async (req, res) => {
    try {
      const subCategory = await storage.getSubCategory(req.params.id);
      if (!subCategory) {
        return res.status(404).json({ message: "Sub-category not found" });
      }
      res.json(subCategory);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sub-category" });
    }
  });

  app.get("/api/sub-categories/category/:categoryId", async (req, res) => {
    try {
      const subCategories = await storage.getSubCategoriesByCategoryId(req.params.categoryId);
      res.json(subCategories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sub-categories by category" });
    }
  });

  app.post("/api/sub-categories", async (req, res) => {
    try {
      const subCategoryData = insertSubCategorySchema.parse(req.body);
      const subCategory = await storage.createSubCategory(subCategoryData);
      res.status(201).json(subCategory);
    } catch (error) {
      res.status(400).json({ message: "Invalid sub-category data" });
    }
  });

  app.put("/api/sub-categories/:id", async (req, res) => {
    try {
      const subCategoryData = insertSubCategorySchema.partial().parse(req.body);
      const subCategory = await storage.updateSubCategory(req.params.id, subCategoryData);
      if (!subCategory) {
        return res.status(404).json({ message: "Sub-category not found" });
      }
      res.json(subCategory);
    } catch (error) {
      res.status(400).json({ message: "Invalid sub-category data" });
    }
  });

  app.delete("/api/sub-categories/:id", async (req, res) => {
    try {
      const success = await storage.deleteSubCategory(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Sub-category not found" });
      }
      res.json({ message: "Sub-category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete sub-category" });
    }
  });

  // Brands
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to get brands" });
    }
  });

  app.get("/api/brands/:id", async (req, res) => {
    try {
      const brand = await storage.getBrand(req.params.id);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ message: "Failed to get brand" });
    }
  });

  app.post("/api/brands", async (req, res) => {
    try {
      const brandData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(brandData);
      res.status(201).json(brand);
    } catch (error) {
      res.status(400).json({ message: "Invalid brand data" });
    }
  });

  app.put("/api/brands/:id", async (req, res) => {
    try {
      const brandData = insertBrandSchema.partial().parse(req.body);
      const brand = await storage.updateBrand(req.params.id, brandData);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      res.status(400).json({ message: "Invalid brand data" });
    }
  });

  app.delete("/api/brands/:id", async (req, res) => {
    try {
      const success = await storage.deleteBrand(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json({ message: "Brand deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });

  // Units
  app.get("/api/units", async (req, res) => {
    try {
      const units = await storage.getUnits();
      res.json(units);
    } catch (error) {
      res.status(500).json({ message: "Failed to get units" });
    }
  });

  app.get("/api/units/:id", async (req, res) => {
    try {
      const unit = await storage.getUnit(req.params.id);
      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }
      res.json(unit);
    } catch (error) {
      res.status(500).json({ message: "Failed to get unit" });
    }
  });

  app.post("/api/units", async (req, res) => {
    try {
      const unitData = insertUnitSchema.parse(req.body);
      const unit = await storage.createUnit(unitData);
      res.status(201).json(unit);
    } catch (error) {
      res.status(400).json({ message: "Invalid unit data" });
    }
  });

  app.put("/api/units/:id", async (req, res) => {
    try {
      const unitData = insertUnitSchema.partial().parse(req.body);
      const unit = await storage.updateUnit(req.params.id, unitData);
      if (!unit) {
        return res.status(404).json({ message: "Unit not found" });
      }
      res.json(unit);
    } catch (error) {
      res.status(400).json({ message: "Invalid unit data" });
    }
  });

  app.delete("/api/units/:id", async (req, res) => {
    try {
      const success = await storage.deleteUnit(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Unit not found" });
      }
      res.json({ message: "Unit deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete unit" });
    }
  });

  // VariantAttributes
  app.get("/api/variant-attributes", async (req, res) => {
    try {
      const variantAttributes = await storage.getVariantAttributes();
      res.json(variantAttributes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get variant attributes" });
    }
  });

  app.get("/api/variant-attributes/:id", async (req, res) => {
    try {
      const variantAttribute = await storage.getVariantAttribute(req.params.id);
      if (!variantAttribute) {
        return res.status(404).json({ message: "Variant attribute not found" });
      }
      res.json(variantAttribute);
    } catch (error) {
      res.status(500).json({ message: "Failed to get variant attribute" });
    }
  });

  app.post("/api/variant-attributes", async (req, res) => {
    try {
      const variantAttributeData = insertVariantAttributeSchema.parse(req.body);
      const variantAttribute = await storage.createVariantAttribute(variantAttributeData);
      res.status(201).json(variantAttribute);
    } catch (error) {
      res.status(400).json({ message: "Invalid variant attribute data" });
    }
  });

  app.put("/api/variant-attributes/:id", async (req, res) => {
    try {
      const variantAttributeData = insertVariantAttributeSchema.partial().parse(req.body);
      const variantAttribute = await storage.updateVariantAttribute(req.params.id, variantAttributeData);
      if (!variantAttribute) {
        return res.status(404).json({ message: "Variant attribute not found" });
      }
      res.json(variantAttribute);
    } catch (error) {
      res.status(400).json({ message: "Invalid variant attribute data" });
    }
  });

  app.delete("/api/variant-attributes/:id", async (req, res) => {
    try {
      const success = await storage.deleteVariantAttribute(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Variant attribute not found" });
      }
      res.json({ message: "Variant attribute deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete variant attribute" });
    }
  });

  // Warranties
  app.get("/api/warranties", async (req, res) => {
    try {
      const warranties = await storage.getWarranties();
      res.json(warranties);
    } catch (error) {
      res.status(500).json({ message: "Failed to get warranties" });
    }
  });

  app.get("/api/warranties/:id", async (req, res) => {
    try {
      const warranty = await storage.getWarranty(req.params.id);
      if (!warranty) {
        return res.status(404).json({ message: "Warranty not found" });
      }
      res.json(warranty);
    } catch (error) {
      res.status(500).json({ message: "Failed to get warranty" });
    }
  });

  app.post("/api/warranties", async (req, res) => {
    try {
      const warrantyData = insertWarrantySchema.parse(req.body);
      const warranty = await storage.createWarranty(warrantyData);
      res.status(201).json(warranty);
    } catch (error) {
      res.status(400).json({ message: "Invalid warranty data" });
    }
  });

  app.put("/api/warranties/:id", async (req, res) => {
    try {
      const warrantyData = insertWarrantySchema.partial().parse(req.body);
      const warranty = await storage.updateWarranty(req.params.id, warrantyData);
      if (!warranty) {
        return res.status(404).json({ message: "Warranty not found" });
      }
      res.json(warranty);
    } catch (error) {
      res.status(400).json({ message: "Invalid warranty data" });
    }
  });

  app.delete("/api/warranties/:id", async (req, res) => {
    try {
      const success = await storage.deleteWarranty(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Warranty not found" });
      }
      res.json({ message: "Warranty deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete warranty" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to get products" });
    }
  });

  app.get("/api/products/low-stock", async (req, res) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to get low stock products" });
    }
  });

  app.get("/api/products/top-selling", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const products = await storage.getTopSellingProducts(limit);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to get top selling products" });
    }
  });

  app.get("/api/products/expired", async (req, res) => {
    try {
      const products = await storage.getExpiredProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to get expired products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to get product" });
    }
  });

  app.post("/api/products", upload.single("image"), async (req, res) => {
    try {
      // Parse fields from FormData - keep cost and price as strings for decimal precision
      const parsedBody = {
        ...req.body,
        cost: req.body.cost || undefined,
        price: req.body.price || undefined,
        stock: req.body.stock ? parseInt(req.body.stock, 10) : undefined,
        minStock: req.body.minStock ? parseInt(req.body.minStock, 10) : undefined,
        isActive: req.body.isActive === 'true' || req.body.isActive === true,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined
      };
      const productData = insertProductSchema.parse(parsedBody);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Product creation error:", error);
      res.status(400).json({ 
        message: "Invalid product data",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.put("/api/products/:id", upload.single("image"), async (req, res) => {
    try {
      // Parse fields from FormData - keep cost and price as strings for decimal precision
      const parsedBody = {
        ...req.body,
        ...(req.body.cost && { cost: req.body.cost }),
        ...(req.body.price && { price: req.body.price }),
        ...(req.body.stock && { stock: parseInt(req.body.stock, 10) }),
        ...(req.body.minStock && { minStock: parseInt(req.body.minStock, 10) }),
        ...(req.body.isActive !== undefined && { isActive: req.body.isActive === 'true' || req.body.isActive === true }),
        ...(req.file && { imageUrl: `/uploads/${req.file.filename}` })
      };
      const productData = insertProductSchema.partial().parse(parsedBody);
      const product = await storage.updateProduct(req.params.id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Customers
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get customers" });
    }
  });

  app.get("/api/customers/top", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const customers = await storage.getTopCustomers(limit);
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get top customers" });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to get customer" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ message: "Invalid customer data" });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.partial().parse(req.body);
      const customer = await storage.updateCustomer(req.params.id, customerData);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(400).json({ message: "Invalid customer data" });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const success = await storage.deleteCustomer(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json({ message: "Customer deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Suppliers
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get suppliers" });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await storage.getSupplier(req.params.id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to get supplier" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(supplierData);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Invalid supplier data" });
    }
  });

  app.put("/api/suppliers/:id", async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.partial().parse(req.body);
      const supplier = await storage.updateSupplier(req.params.id, supplierData);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Invalid supplier data" });
    }
  });

  app.delete("/api/suppliers/:id", async (req, res) => {
    try {
      const success = await storage.deleteSupplier(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json({ message: "Supplier deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete supplier" });
    }
  });

  // Sales
  app.get("/api/sales", async (req, res) => {
    try {
      const sales = await storage.getSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sales" });
    }
  });

  app.get("/api/sales/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const sales = await storage.getRecentSales(limit);
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recent sales" });
    }
  });

  app.get("/api/sales/:id", async (req, res) => {
    try {
      const sale = await storage.getSale(req.params.id);
      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }
      res.json(sale);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sale" });
    }
  });

  app.post("/api/sales", async (req, res) => {
    try {
      const saleData = insertSaleSchema.parse(req.body);
      const sale = await storage.createSale(saleData);
      res.status(201).json(sale);
    } catch (error) {
      res.status(400).json({ message: "Invalid sale data" });
    }
  });

  // Purchases
  app.get("/api/purchases", async (req, res) => {
    try {
      const purchases = await storage.getPurchases();
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to get purchases" });
    }
  });

  app.get("/api/purchases/:id", async (req, res) => {
    try {
      const purchase = await storage.getPurchase(req.params.id);
      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      res.json(purchase);
    } catch (error) {
      res.status(500).json({ message: "Failed to get purchase" });
    }
  });

  app.post("/api/purchases", async (req, res) => {
    try {
      const purchaseData = insertPurchaseSchema.parse(req.body);
      const purchase = await storage.createPurchase(purchaseData);
      res.status(201).json(purchase);
    } catch (error) {
      res.status(400).json({ message: "Invalid purchase data" });
    }
  });

  // Expenses
  app.get("/api/expenses", async (req, res) => {
    try {
      const expenses = await storage.getExpenses();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to get expenses" });
    }
  });

  app.get("/api/expenses/:id", async (req, res) => {
    try {
      const expense = await storage.getExpense(req.params.id);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: "Failed to get expense" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const expenseData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(expenseData);
      res.status(201).json(expense);
    } catch (error) {
      res.status(400).json({ message: "Invalid expense data" });
    }
  });

  app.put("/api/expenses/:id", async (req, res) => {
    try {
      const expenseData = insertExpenseSchema.partial().parse(req.body);
      const expense = await storage.updateExpense(req.params.id, expenseData);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      res.status(400).json({ message: "Invalid expense data" });
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      const success = await storage.deleteExpense(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  // Sale Items
  app.get("/api/sale-items/:saleId", async (req, res) => {
    try {
      const saleItems = await storage.getSaleItems(req.params.saleId);
      res.json(saleItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sale items" });
    }
  });

  app.post("/api/sale-items", async (req, res) => {
    try {
      const saleItemData = insertSaleItemSchema.parse(req.body);
      const saleItem = await storage.createSaleItem(saleItemData);
      res.status(201).json(saleItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid sale item data" });
    }
  });

  // Purchase Items
  app.get("/api/purchase-items/:purchaseId", async (req, res) => {
    try {
      const purchaseItems = await storage.getPurchaseItems(req.params.purchaseId);
      res.json(purchaseItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to get purchase items" });
    }
  });

  app.post("/api/purchase-items", async (req, res) => {
    try {
      const purchaseItemData = insertPurchaseItemSchema.parse(req.body);
      const purchaseItem = await storage.createPurchaseItem(purchaseItemData);
      res.status(201).json(purchaseItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid purchase item data" });
    }
  });

  // StockAdjustments
  app.get("/api/stock-adjustments", async (req, res) => {
    try {
      const stockAdjustments = await storage.getStockAdjustments();
      res.json(stockAdjustments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stock adjustments" });
    }
  });

  app.get("/api/stock-adjustments/:id", async (req, res) => {
    try {
      const stockAdjustment = await storage.getStockAdjustment(req.params.id);
      if (!stockAdjustment) {
        return res.status(404).json({ message: "Stock adjustment not found" });
      }
      res.json(stockAdjustment);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stock adjustment" });
    }
  });

  app.get("/api/stock-adjustments/product/:productId", async (req, res) => {
    try {
      const stockAdjustments = await storage.getStockAdjustmentsByProductId(req.params.productId);
      res.json(stockAdjustments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stock adjustments by product" });
    }
  });

  app.post("/api/stock-adjustments", async (req, res) => {
    try {
      const stockAdjustmentData = insertStockAdjustmentSchema.parse(req.body);
      const stockAdjustment = await storage.createStockAdjustment(stockAdjustmentData);
      res.status(201).json(stockAdjustment);
    } catch (error) {
      res.status(400).json({ message: "Invalid stock adjustment data" });
    }
  });

  // StockTransfers
  app.get("/api/stock-transfers", async (req, res) => {
    try {
      const stockTransfers = await storage.getStockTransfers();
      res.json(stockTransfers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stock transfers" });
    }
  });

  app.get("/api/stock-transfers/:id", async (req, res) => {
    try {
      const stockTransfer = await storage.getStockTransfer(req.params.id);
      if (!stockTransfer) {
        return res.status(404).json({ message: "Stock transfer not found" });
      }
      res.json(stockTransfer);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stock transfer" });
    }
  });

  app.get("/api/stock-transfers/product/:productId", async (req, res) => {
    try {
      const stockTransfers = await storage.getStockTransfersByProductId(req.params.productId);
      res.json(stockTransfers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stock transfers by product" });
    }
  });

  app.post("/api/stock-transfers", async (req, res) => {
    try {
      const stockTransferData = insertStockTransferSchema.parse(req.body);
      const stockTransfer = await storage.createStockTransfer(stockTransferData);
      res.status(201).json(stockTransfer);
    } catch (error) {
      res.status(400).json({ message: "Invalid stock transfer data" });
    }
  });

  app.put("/api/stock-transfers/:id", async (req, res) => {
    try {
      const stockTransferData = insertStockTransferSchema.partial().parse(req.body);
      const stockTransfer = await storage.updateStockTransfer(req.params.id, stockTransferData);
      if (!stockTransfer) {
        return res.status(404).json({ message: "Stock transfer not found" });
      }
      res.json(stockTransfer);
    } catch (error) {
      res.status(400).json({ message: "Invalid stock transfer data" });
    }
  });

  // PurchaseOrders
  app.get("/api/purchase-orders", async (req, res) => {
    try {
      const purchaseOrders = await storage.getPurchaseOrders();
      res.json(purchaseOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get purchase orders" });
    }
  });

  app.get("/api/purchase-orders/:id", async (req, res) => {
    try {
      const purchaseOrder = await storage.getPurchaseOrder(req.params.id);
      if (!purchaseOrder) {
        return res.status(404).json({ message: "Purchase order not found" });
      }
      res.json(purchaseOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to get purchase order" });
    }
  });

  app.post("/api/purchase-orders", async (req, res) => {
    try {
      const purchaseOrderData = insertPurchaseOrderSchema.parse(req.body);
      const purchaseOrder = await storage.createPurchaseOrder(purchaseOrderData);
      res.status(201).json(purchaseOrder);
    } catch (error) {
      res.status(400).json({ message: "Invalid purchase order data" });
    }
  });

  app.put("/api/purchase-orders/:id", async (req, res) => {
    try {
      const purchaseOrderData = insertPurchaseOrderSchema.partial().parse(req.body);
      const purchaseOrder = await storage.updatePurchaseOrder(req.params.id, purchaseOrderData);
      if (!purchaseOrder) {
        return res.status(404).json({ message: "Purchase order not found" });
      }
      res.json(purchaseOrder);
    } catch (error) {
      res.status(400).json({ message: "Invalid purchase order data" });
    }
  });

  // PurchaseOrderItems
  app.get("/api/purchase-order-items/:purchaseOrderId", async (req, res) => {
    try {
      const purchaseOrderItems = await storage.getPurchaseOrderItems(req.params.purchaseOrderId);
      res.json(purchaseOrderItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to get purchase order items" });
    }
  });

  app.post("/api/purchase-order-items", async (req, res) => {
    try {
      const purchaseOrderItemData = insertPurchaseOrderItemSchema.parse(req.body);
      const purchaseOrderItem = await storage.createPurchaseOrderItem(purchaseOrderItemData);
      res.status(201).json(purchaseOrderItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid purchase order item data" });
    }
  });

  // SalesReturns
  app.get("/api/sales-returns", async (req, res) => {
    try {
      const salesReturns = await storage.getSalesReturns();
      res.json(salesReturns);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sales returns" });
    }
  });

  app.get("/api/sales-returns/:id", async (req, res) => {
    try {
      const salesReturn = await storage.getSalesReturn(req.params.id);
      if (!salesReturn) {
        return res.status(404).json({ message: "Sales return not found" });
      }
      res.json(salesReturn);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sales return" });
    }
  });

  app.post("/api/sales-returns", async (req, res) => {
    try {
      const salesReturnData = insertSalesReturnSchema.parse(req.body);
      const salesReturn = await storage.createSalesReturn(salesReturnData);
      res.status(201).json(salesReturn);
    } catch (error) {
      res.status(400).json({ message: "Invalid sales return data" });
    }
  });

  // SalesReturnItems
  app.get("/api/sales-return-items/:salesReturnId", async (req, res) => {
    try {
      const salesReturnItems = await storage.getSalesReturnItems(req.params.salesReturnId);
      res.json(salesReturnItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sales return items" });
    }
  });

  app.post("/api/sales-return-items", async (req, res) => {
    try {
      const salesReturnItemData = insertSalesReturnItemSchema.parse(req.body);
      const salesReturnItem = await storage.createSalesReturnItem(salesReturnItemData);
      res.status(201).json(salesReturnItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid sales return item data" });
    }
  });

  // PurchaseReturns
  app.get("/api/purchase-returns", async (req, res) => {
    try {
      const purchaseReturns = await storage.getPurchaseReturns();
      res.json(purchaseReturns);
    } catch (error) {
      res.status(500).json({ message: "Failed to get purchase returns" });
    }
  });

  app.get("/api/purchase-returns/:id", async (req, res) => {
    try {
      const purchaseReturn = await storage.getPurchaseReturn(req.params.id);
      if (!purchaseReturn) {
        return res.status(404).json({ message: "Purchase return not found" });
      }
      res.json(purchaseReturn);
    } catch (error) {
      res.status(500).json({ message: "Failed to get purchase return" });
    }
  });

  app.post("/api/purchase-returns", async (req, res) => {
    try {
      const purchaseReturnData = insertPurchaseReturnSchema.parse(req.body);
      const purchaseReturn = await storage.createPurchaseReturn(purchaseReturnData);
      res.status(201).json(purchaseReturn);
    } catch (error) {
      res.status(400).json({ message: "Invalid purchase return data" });
    }
  });

  // PurchaseReturnItems
  app.get("/api/purchase-return-items/:purchaseReturnId", async (req, res) => {
    try {
      const purchaseReturnItems = await storage.getPurchaseReturnItems(req.params.purchaseReturnId);
      res.json(purchaseReturnItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to get purchase return items" });
    }
  });

  app.post("/api/purchase-return-items", async (req, res) => {
    try {
      const purchaseReturnItemData = insertPurchaseReturnItemSchema.parse(req.body);
      const purchaseReturnItem = await storage.createPurchaseReturnItem(purchaseReturnItemData);
      res.status(201).json(purchaseReturnItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid purchase return item data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
