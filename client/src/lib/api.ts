import { apiRequest } from "./queryClient";

// Dashboard
export const getDashboardStats = async () => {
  const response = await apiRequest("GET", "/api/dashboard/stats");
  return response.json();
};

// Categories
export const getCategories = async () => {
  const response = await apiRequest("GET", "/api/categories");
  return response.json();
};

export const createCategory = async (data: any) => {
  const response = await apiRequest("POST", "/api/categories", data);
  return response.json();
};

export const updateCategory = async (id: string, data: any) => {
  const response = await apiRequest("PUT", `/api/categories/${id}`, data);
  return response.json();
};

export const deleteCategory = async (id: string) => {
  const response = await apiRequest("DELETE", `/api/categories/${id}`);
  return response.json();
};

// Products
export const getProducts = async () => {
  const response = await apiRequest("GET", "/api/products");
  return response.json();
};

export const getLowStockProducts = async () => {
  const response = await apiRequest("GET", "/api/products/low-stock");
  return response.json();
};

export const getTopSellingProducts = async (limit = 10) => {
  const response = await apiRequest("GET", `/api/products/top-selling?limit=${limit}`);
  return response.json();
};

export const createProduct = async (data: FormData) => {
  const response = await fetch("/api/products", {
    method: "POST",
    body: data,
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Failed to create product");
  }
  
  return response.json();
};

export const updateProduct = async (id: string, data: FormData) => {
  const response = await fetch(`/api/products/${id}`, {
    method: "PUT",
    body: data,
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Failed to update product");
  }
  
  return response.json();
};

export const deleteProduct = async (id: string) => {
  const response = await apiRequest("DELETE", `/api/products/${id}`);
  return response.json();
};

// Customers
export const getCustomers = async () => {
  const response = await apiRequest("GET", "/api/customers");
  return response.json();
};

export const getTopCustomers = async (limit = 10) => {
  const response = await apiRequest("GET", `/api/customers/top?limit=${limit}`);
  return response.json();
};

export const createCustomer = async (data: any) => {
  const response = await apiRequest("POST", "/api/customers", data);
  return response.json();
};

export const updateCustomer = async (id: string, data: any) => {
  const response = await apiRequest("PUT", `/api/customers/${id}`, data);
  return response.json();
};

export const deleteCustomer = async (id: string) => {
  const response = await apiRequest("DELETE", `/api/customers/${id}`);
  return response.json();
};

// Suppliers
export const getSuppliers = async () => {
  const response = await apiRequest("GET", "/api/suppliers");
  return response.json();
};

export const createSupplier = async (data: any) => {
  const response = await apiRequest("POST", "/api/suppliers", data);
  return response.json();
};

export const updateSupplier = async (id: string, data: any) => {
  const response = await apiRequest("PUT", `/api/suppliers/${id}`, data);
  return response.json();
};

export const deleteSupplier = async (id: string) => {
  const response = await apiRequest("DELETE", `/api/suppliers/${id}`);
  return response.json();
};

// Sales
export const getSales = async () => {
  const response = await apiRequest("GET", "/api/sales");
  return response.json();
};

export const getRecentSales = async (limit = 10) => {
  const response = await apiRequest("GET", `/api/sales/recent?limit=${limit}`);
  return response.json();
};

export const createSale = async (data: any) => {
  const response = await apiRequest("POST", "/api/sales", data);
  return response.json();
};

// Purchases
export const getPurchases = async () => {
  const response = await apiRequest("GET", "/api/purchases");
  return response.json();
};

export const createPurchase = async (data: any) => {
  const response = await apiRequest("POST", "/api/purchases", data);
  return response.json();
};

// Expenses
export const getExpenses = async () => {
  const response = await apiRequest("GET", "/api/expenses");
  return response.json();
};

export const createExpense = async (data: any) => {
  const response = await apiRequest("POST", "/api/expenses", data);
  return response.json();
};

export const updateExpense = async (id: string, data: any) => {
  const response = await apiRequest("PUT", `/api/expenses/${id}`, data);
  return response.json();
};

export const deleteExpense = async (id: string) => {
  const response = await apiRequest("DELETE", `/api/expenses/${id}`);
  return response.json();
};

// Brands
export const getBrands = async () => {
  const response = await apiRequest("GET", "/api/brands");
  return response.json();
};

export const createBrand = async (data: any) => {
  const response = await apiRequest("POST", "/api/brands", data);
  return response.json();
};

export const updateBrand = async (id: string, data: any) => {
  const response = await apiRequest("PUT", `/api/brands/${id}`, data);
  return response.json();
};

export const deleteBrand = async (id: string) => {
  const response = await apiRequest("DELETE", `/api/brands/${id}`);
  return response.json();
};

// Units
export const getUnits = async () => {
  const response = await apiRequest("GET", "/api/units");
  return response.json();
};

export const createUnit = async (data: any) => {
  const response = await apiRequest("POST", "/api/units", data);
  return response.json();
};

export const updateUnit = async (id: string, data: any) => {
  const response = await apiRequest("PUT", `/api/units/${id}`, data);
  return response.json();
};

export const deleteUnit = async (id: string) => {
  const response = await apiRequest("DELETE", `/api/units/${id}`);
  return response.json();
};

// SubCategories
export const getSubCategories = async () => {
  const response = await apiRequest("GET", "/api/sub-categories");
  return response.json();
};

export const createSubCategory = async (data: any) => {
  const response = await apiRequest("POST", "/api/sub-categories", data);
  return response.json();
};

export const updateSubCategory = async (id: string, data: any) => {
  const response = await apiRequest("PUT", `/api/sub-categories/${id}`, data);
  return response.json();
};

export const deleteSubCategory = async (id: string) => {
  const response = await apiRequest("DELETE", `/api/sub-categories/${id}`);
  return response.json();
};

// VariantAttributes
export const getVariantAttributes = async () => {
  const response = await apiRequest("GET", "/api/variant-attributes");
  return response.json();
};

export const createVariantAttribute = async (data: any) => {
  const response = await apiRequest("POST", "/api/variant-attributes", data);
  return response.json();
};

export const updateVariantAttribute = async (id: string, data: any) => {
  const response = await apiRequest("PUT", `/api/variant-attributes/${id}`, data);
  return response.json();
};

export const deleteVariantAttribute = async (id: string) => {
  const response = await apiRequest("DELETE", `/api/variant-attributes/${id}`);
  return response.json();
};

// Warranties
export const getWarranties = async () => {
  const response = await apiRequest("GET", "/api/warranties");
  return response.json();
};

export const createWarranty = async (data: any) => {
  const response = await apiRequest("POST", "/api/warranties", data);
  return response.json();
};

export const updateWarranty = async (id: string, data: any) => {
  const response = await apiRequest("PUT", `/api/warranties/${id}`, data);
  return response.json();
};

export const deleteWarranty = async (id: string) => {
  const response = await apiRequest("DELETE", `/api/warranties/${id}`);
  return response.json();
};

// Expired Products
export const getExpiredProducts = async () => {
  const response = await apiRequest("GET", "/api/products/expired");
  return response.json();
};
