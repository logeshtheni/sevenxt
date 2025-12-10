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
    const users = await this.request<UserData[]>("/api/v1/auth/users");
    return [...employees, ...users];
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
