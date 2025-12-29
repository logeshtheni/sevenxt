const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:8001";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  email: string;
  name: string | null;
  role: string;
  status: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  permissions?: string[] | null;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserData;
}

export interface ApiError {
  detail: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();

    // Normalize base URL and endpoint to avoid double-slashes
    const base = API_BASE_URL.replace(/\/+$/g, "");
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${base}${path}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('📡 API Response:', {
      url: url,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    // Parse JSON once (works for both success and error responses)
    const data = await response.json().catch(() => ({
      detail: "An error occurred",
    }));

    console.log('📦 Response Data:', data);

    if (!response.ok) {
      console.error('❌ API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      const error: ApiError = data as ApiError;
      throw new Error(error.detail || `HTTP error: ${response.status} ${response.statusText}`);
    }

    return data;
  }

  /** 🔐 LOGIN */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>("/api/v1/auth/login-json", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    localStorage.setItem("auth_token", response.access_token);
    localStorage.setItem("user", JSON.stringify(response.user));

    return response;
  }

  /** 👤 Current Auth User */
  async getCurrentUser(): Promise<UserData> {
    return this.request<UserData>("/api/v1/auth/me");
  }

  /** 👥 Get All Users */
  async getUsers(): Promise<UserData[]> {
    const employees = await this.request<UserData[]>("/api/v1/employees");
    const b2bUsers = await this.request<UserData[]>("/api/v1/users/b2b");
    const b2cUsers = await this.request<UserData[]>("/api/v1/users/b2c");

    const taggedEmployees = employees.map(e => ({ ...e, origin: 'employee' }));
    const taggedB2B = b2bUsers.map(u => ({ ...u, origin: 'b2b', role: 'b2b' }));
    const taggedB2C = b2cUsers.map(u => ({ ...u, origin: 'b2c', role: 'b2c' }));

    return [...taggedEmployees, ...taggedB2B, ...taggedB2C];
  }

  /** ➕ Create User */
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    status: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    permissions?: string[];
  }): Promise<UserData> {
    const isEmployee = userData.role === "admin" || userData.role === "staff";
    const endpoint = isEmployee
      ? "/api/v1/employees/create"
      : "/api/v1/auth/register";

    return this.request<UserData>(endpoint, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  /** 🗑️ Delete User */
  async deleteUser(id: string, type: string): Promise<void> {
    // ID comes as "Admin-1", we need just "1"
    const numericId = id.split('-')[1];
    return this.request<void>(`/api/v1/users/${numericId}?type=${type}`, {
      method: "DELETE",
    });
  }

  /** ✏️ Update User */
  async updateUser(id: string, type: string, userData: any): Promise<any> {
    const numericId = id.split('-')[1];
    return this.request<any>(`/api/v1/users/${numericId}?type=${type}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  /** 🚪 Logout */
  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }

  /** 🔎 Check Auth State */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // -------------- ADMIN PASSWORD RESET ----------------

  /** 🔑 Admin Reset User Password */
  async adminResetPassword(userId: number, newPassword: string): Promise<{
    message: string;
    user_id: number;
    email: string;
    password_updated: boolean;
  }> {
    return this.request("/api/v1/auth/admin/reset-password", {
      method: "POST",
      body: JSON.stringify({ user_id: userId, new_password: newPassword }),
    });
  }

  // -------------- USER PASSWORD RESET (OTP) ----------------

  /** 📧 Request OTP */
  async forgotPassword(email: string): Promise<{
    message: string;
    dev_otp?: string;
  }> {
    return this.request("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  /** 🔑 Reset Password with OTP */
  async resetPasswordWithOTP(email: string, otp: string, newPassword: string): Promise<{ message: string }> {
    return this.request("/api/v1/auth/reset-password-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp, new_password: newPassword }),
    });
  }

  // -------------- PRODUCT APIs ----------------

  async fetchProducts(): Promise<any[]> {
    return this.request<any[]>("/api/v1/products");
  }

  async createProduct(productData: any): Promise<any> {
    return this.request<any>("/api/v1/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any): Promise<any> {
    return this.request<any>(`/api/v1/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request<void>(`/api/v1/products/${id}`, {
      method: "DELETE",
    });
  }

  /** 📦 Import Products from Excel */
  async importProducts(file: File): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append("file", file);

    const base = API_BASE_URL.replace(/\/+$/g, "");
    const url = `${base}/api/v1/products/import`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json().catch(() => ({
      detail: "An error occurred during import",
    }));

    if (!response.ok) {
      throw new Error(data.detail || `Import failed: ${response.status}`);
    }

    return data;
  }

  // -------------- ORDER APIs ----------------

  async fetchOrders(): Promise<any[]> {
    return this.request<any[]>("/api/v1/orders");
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    return this.request<any>(`/api/v1/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async updateOrderDimensions(orderId: string, dimensions: { height: number, weight: number, breadth: number, length: number }): Promise<any> {
    return this.request<any>(`/api/v1/orders/${orderId}/dimensions`, {
      method: "PUT",
      body: JSON.stringify(dimensions),
    });
  }

  async fetchDeliveries(): Promise<any[]> {
    return this.request<any[]>("/api/v1/orders/deliveries");
  }

  async updateDeliverySchedule(deliveryId: number, schedulePickup: string): Promise<any> {
    // Ensure deliveryId is a number
    if (!deliveryId) throw new Error("Delivery ID is required");

    return this.request<any>(`/api/v1/orders/deliveries/${deliveryId}/schedule`, {
      method: "PUT",
      body: JSON.stringify({ schedule_pickup: schedulePickup }),
    });
  }

  // -------------- REFUND APIs ----------------

  async fetchRefunds(status?: string): Promise<any[]> {
    const endpoint = status ? `/api/v1/refunds?status=${status}` : "/api/v1/refunds";
    return this.request<any[]>(endpoint);
  }

  async getRefund(refundId: number): Promise<any> {
    return this.request<any>(`/api/v1/refunds/${refundId}`);
  }

  async createRefund(refundData: {
    order_id: number;
    reason: string;
    amount: number;
    proof_image_path?: string;
  }): Promise<any> {
    return this.request<any>("/api/v1/refunds", {
      method: "POST",
      body: JSON.stringify(refundData),
    });
  }

  async updateRefundStatus(refundId: number, status: string): Promise<any> {
    return this.request<any>(`/api/v1/refunds/${refundId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async updateRefundAWB(refundId: number, awbData: {
    return_awb_number: string;
    return_label_path: string;
  }): Promise<any> {
    return this.request<any>(`/api/v1/refunds/${refundId}/awb`, {
      method: "PUT",
      body: JSON.stringify(awbData),
    });
  }

  async deleteRefund(refundId: number): Promise<void> {
    return this.request<void>(`/api/v1/refunds/${refundId}`, {
      method: "DELETE",
    });
  }

  // -------------- EXCHANGE APIs ----------------

  async fetchExchanges(status?: string): Promise<any[]> {
    const endpoint = status ? `/api/v1/exchanges?status=${status}` : "/api/v1/exchanges";
    return this.request<any[]>(endpoint);
  }

  async approveExchange(exchangeId: number): Promise<any> {
    return this.request<any>(`/api/v1/exchanges/${exchangeId}/approve`, {
      method: "POST",
    });
  }

  async qualityCheckExchange(exchangeId: number, approved: boolean, notes: string): Promise<any> {
    return this.request<any>(`/api/v1/exchanges/${exchangeId}/quality-check`, {
      method: "POST",
      body: JSON.stringify({ approved, notes }),
    });
  }

  async processExchangeReplacement(exchangeId: number): Promise<any> {
    return this.request<any>(`/api/v1/exchanges/${exchangeId}/process-replacement`, {
      method: "POST",
    });
  }

  async refundExchange(exchangeId: number): Promise<any> {
    return this.request<any>(`/api/v1/exchanges/${exchangeId}/refund`, {
      method: "POST",
    });
  }

  // -------------- BULK AWB DOWNLOAD ----------------

  async bulkDownloadAWBLabels(orderIds: string[]): Promise<Blob> {
    const token = this.getAuthToken();
    const base = API_BASE_URL.replace(/\/+$/g, "");
    const url = `${base}/api/v1/orders/bulk-download-awb`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(orderIds),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Download failed" }));
      throw new Error(error.detail || `Download failed: ${response.status}`);
    }

    return response.blob();
  }

  // -------------- ACTIVITY LOGS APIs ----------------

  async getActivityLogs(params?: {
    skip?: number;
    limit?: number;
    user_type?: string;
    module?: string;
    status?: string;
    search?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const endpoint = `/api/v1/activity-logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<any[]>(endpoint);
  }

  async getActivityLogStats(days: number = 7): Promise<any> {
    return this.request<any>(`/api/v1/activity-logs/stats?days=${days}`);
  }

  async exportActivityLogs(params?: {
    user_type?: string;
    module?: string;
    status?: string;
    search?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Blob> {
    const token = this.getAuthToken();
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const base = API_BASE_URL.replace(/\/+$/g, "");
    const url = `${base}/api/v1/activity-logs/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Export failed" }));
      throw new Error(error.detail || `Export failed: ${response.status}`);
    }

    return response.blob();
  }
}


export const apiService = new ApiService();

// Helper exports
export const fetchProducts = () => apiService.fetchProducts();
export const createProduct = (productData: any) =>
  apiService.createProduct(productData);
export const updateProduct = (id: string, productData: any) =>
  apiService.updateProduct(id, productData);
export const deleteProduct = (id: string) =>
  apiService.deleteProduct(id);
export const importProducts = (file: File) =>
  apiService.importProducts(file);
export const updateOrderStatus = (orderId: string, status: string) =>
  apiService.updateOrderStatus(orderId, status);

