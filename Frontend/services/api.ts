const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:8001";

/* =======================
   AUTH TYPES
======================= */

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

/* =======================
   API SERVICE
======================= */

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();

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

    const data = await response.json().catch(() => ({
      detail: "An error occurred",
    }));

    if (!response.ok) {
      throw new Error(
        typeof data.detail === "string"
          ? data.detail
          : JSON.stringify(data.detail)
      );
    }

    return data;
  }

  /* =======================
      AUTH
  ======================= */

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const res = await this.request<LoginResponse>(
      "/api/v1/auth/login-json",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    );

    localStorage.setItem("auth_token", res.access_token);
    localStorage.setItem("user", JSON.stringify(res.user));

    return res;
  }

  async getCurrentUser(): Promise<UserData> {
    return this.request("/api/v1/auth/me");
  }

  async getUsers(): Promise<UserData[]> {
    const employees = await this.request<UserData[]>(
      "/api/v1/employees"
    );
    const users = await this.request<UserData[]>(
      "/api/v1/auth/users"
    );
    return [...employees, ...users];
  }

  async createUser(userData: any): Promise<UserData> {
    const isEmployee =
      userData.role === "admin" || userData.role === "staff";

    const endpoint = isEmployee
      ? "/api/v1/employees/create"
      : "/api/v1/auth/register";

    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  /* =======================
      PASSWORD
  ======================= */

  async adminResetPassword(
    userId: number,
    newPassword: string
  ): Promise<any> {
    return this.request("/api/v1/auth/admin/reset-password", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        new_password: newPassword,
      }),
    });
  }

  async forgotPassword(email: string): Promise<any> {
    return this.request("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPasswordWithOTP(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<any> {
    return this.request("/api/v1/auth/reset-password-otp", {
      method: "POST",
      body: JSON.stringify({
        email,
        otp,
        new_password: newPassword,
      }),
    });
  }

  /* =======================
      PRODUCTS
  ======================= */

  async fetchProducts(): Promise<any[]> {
    return this.request("/api/v1/products");
  }

  async createProduct(data: any): Promise<any> {
    return this.request("/api/v1/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any): Promise<any> {
    return this.request(`/api/v1/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request(`/api/v1/products/${id}`, {
      method: "DELETE",
    });
  }

  async importProducts(file: File): Promise<any> {
    const token = this.getAuthToken();
    const formData = new FormData();
    formData.append("file", file);

    const base = API_BASE_URL.replace(/\/+$/g, "");
    const url = `${base}/api/v1/products/import`;

    const response = await fetch(url, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.detail);
    return data;
  }

  /* =======================
      CMS
  ======================= */

  async getCMSBanners(): Promise<any[]> {
    return this.request("/api/v1/cms/banners");
  }

  async createCMSBanner(data: any): Promise<any> {
    return this.request("/api/v1/cms/banners", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCMSBanner(id: number, data: any): Promise<any> {
    return this.request(`/api/v1/cms/banners/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCMSBanner(id: number): Promise<any> {
    return this.request(`/api/v1/cms/banners/${id}`, {
      method: "DELETE",
    });
  }

  async getCMSCategoryBanners(): Promise<any> {
    return this.request("/api/v1/cms/category-banners");
  }

  async updateCMSCategoryBanner(
    category: string, 
    data: { image: string }
  ): Promise<any> {
    return this.request(`/api/v1/cms/category-banners/${category}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  }

  async getCMSNotifications(): Promise<any[]> {
    return this.request("/api/v1/cms/notifications");
  }

  async sendCMSNotification(data: any): Promise<any> {
    return this.request("/api/v1/cms/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCMSPages(): Promise<any[]> {
    return this.request("/api/v1/cms/pages");
  }

  async updateCMSPage(id: number, data: any): Promise<any> {
    return this.request(`/api/v1/cms/pages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /* =======================
      CAMPAIGNS
  ======================= */

  async getCampaignCoupons(): Promise<any[]> {
    return this.request("/api/v1/campaigns/coupons");
  }

  async createCampaignCoupon(data: {
    code: string;
    type: string;
    value: string;
    target: string;
    expiry?: string;
  }): Promise<any> {
    return this.request("/api/v1/campaigns/coupons", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCampaignCoupon(
    id: number,
    data: {
      code: string;
      type: string;
      value: string;
      target: string;
      expiry?: string;
    }
  ): Promise<any> {
    return this.request(`/api/v1/campaigns/coupons/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCampaignCoupon(id: number): Promise<any> {
    return this.request(`/api/v1/campaigns/coupons/${id}`, {
      method: "DELETE",
    });
  }

  async getCampaignFlashDeals(): Promise<any[]> {
    return this.request("/api/v1/campaigns/flash-deals");
  }

  async getCampaignBanners(): Promise<any[]> {
    return this.request("/api/v1/campaigns/banners");
  }

  async getCampaignAdCampaigns(): Promise<any[]> {
    return this.request("/api/v1/campaigns/ad-campaigns");
  }

  /* =======================
      B2B
  ======================= */

  async getB2BUsers(): Promise<any[]> {
    return this.request("/api/v1/b2b/users");
  }

  async updateB2BStatus(id: number, data: { status: string }): Promise<any> {
    return this.request(`/api/v1/b2b/verify/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /* =======================
      FINANCE & PAYMENTS
  ======================= */

  async getTransactions(): Promise<any[]> {
    return this.request("/api/v1/finance/transactions");
  }

  async verifyPayment(paymentData: any): Promise<any> {
    return this.request("/api/v1/finance/verify-payment", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  }
}

/* =======================
   INSTANCE
======================= */

export const apiService = new ApiService();

/* =======================
   HELPERS (EXPORTED)
======================= */

// Products
export const fetchProducts = () => apiService.fetchProducts();
export const createProduct = (d: any) => apiService.createProduct(d);
export const updateProduct = (id: string, d: any) => apiService.updateProduct(id, d);
export const deleteProduct = (id: string) => apiService.deleteProduct(id);
export const importProducts = (f: File) => apiService.importProducts(f);

// CMS
export const getCMSBanners = () => apiService.getCMSBanners();
export const createCMSBanner = (d: any) => apiService.createCMSBanner(d);
export const updateCMSBanner = (id: number, d: any) => apiService.updateCMSBanner(id, d);
export const deleteCMSBanner = (id: number) => apiService.deleteCMSBanner(id);
export const getCMSCategoryBanners = () => apiService.getCMSCategoryBanners();
export const updateCMSCategoryBanner = (category: string, data: { image: string }) => apiService.updateCMSCategoryBanner(category, data);
export const getCMSNotifications = () => apiService.getCMSNotifications();
export const sendCMSNotification = (d: any) => apiService.sendCMSNotification(d);
export const getCMSPages = () => apiService.getCMSPages();
export const updateCMSPage = (id: number, d: any) => apiService.updateCMSPage(id, d);

// CAMPAIGNS
export const getCampaignCoupons = () => apiService.getCampaignCoupons();
export const createCampaignCoupon = (d: any) => apiService.createCampaignCoupon(d);
export const updateCampaignCoupon = (id: number, d: any) => apiService.updateCampaignCoupon(id, d);
export const deleteCampaignCoupon = (id: number) => apiService.deleteCampaignCoupon(id);
export const getCampaignFlashDeals = () => apiService.getCampaignFlashDeals();
export const getCampaignBanners = () => apiService.getCampaignBanners();
export const getCampaignAdCampaigns = () => apiService.getCampaignAdCampaigns();

// B2B
export const getB2BUsers = () => apiService.getB2BUsers();
export const updateB2BStatus = (id: number, d: { status: string }) => apiService.updateB2BStatus(id, d);

// FINANCE & PAYMENTS
export const getTransactions = () => apiService.getTransactions();
export const verifyPayment = (d: any) => apiService.verifyPayment(d);