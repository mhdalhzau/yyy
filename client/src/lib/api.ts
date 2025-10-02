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
