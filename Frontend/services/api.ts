const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: "An error occurred",
      }));
      throw new Error(error.detail || `HTTP error: ${response.status}`);
    }

    return response.json();
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

  /** 👤 CURRENT AUTH USER */
  async getCurrentUser(): Promise<UserData> {
    return this.request<UserData>("/api/v1/auth/me");
  }
  // async deleteUser(id: number) {
  //   return this.request<UserData>(`/api/v1/auth/users/${id}`, {
  //     method: "DELETE"
  //   })
  // }

  /** 👥 ALL USERS (Employees + B2B/B2C) */
  async getUsers(): Promise<UserData[]> {
    // Fetch employees (Admin/Staff)
    const employees = await this.request<UserData[]>("/api/v1/employees");

    // Fetch users (B2B/B2C)
    const users = await this.request<UserData[]>("/api/v1/auth/users");

    // Combine and return
    return [...employees, ...users];
  }

  /** ➕ CREATE USER (all go through register for now) */
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
    const isEmployee = userData.role === 'admin' || userData.role === 'staff';
    const endpoint = isEmployee ? '/api/v1/employees/create' : '/api/v1/auth/register';
    return this.request<UserData>(endpoint, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }


  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Product API Methods
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
}

export const apiService = new ApiService();

// Export product functions for convenience
export const fetchProducts = () => apiService.fetchProducts();
export const createProduct = (productData: any) => apiService.createProduct(productData);
export const updateProduct = (id: string, productData: any) => apiService.updateProduct(id, productData);
export const deleteProduct = (id: string) => apiService.deleteProduct(id);
