import type {
  ApiResponse,
  TokenPair,
  ApiRequestConfig,
  ApiError,
  UserRole,
} from "@/types/api";

/**
 * BaseApi class that provides fundamental HTTP methods and authentication logic
 * All other API classes should inherit from this class to get consistent behavior
 *
 * Features:
 * - Automatic token management (storage, refresh, expiration)
 * - Middleware-like request interception for authentication
 * - Automatic retry with token refresh on 401 errors
 * - Consistent error handling
 * - Request/response type safety
 */
export abstract class BaseApi {
  /** Base URL for all API requests */
  protected static readonly baseURL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  /** Current authentication tokens */
  private static authTokens: TokenPair | null = null;

  /** Promise to prevent multiple simultaneous token refresh attempts */
  private static refreshPromise: Promise<TokenPair> | null = null;

  /** Key used for localStorage token storage */
  private static readonly TOKEN_STORAGE_KEY = "sauvini_auth_tokens";

  // ===========================================
  // TOKEN MANAGEMENT METHODS
  // ===========================================

  /**
   * Store authentication tokens in memory and localStorage
   * @param tokens - The tokens to store
   */
  static setTokens(tokens: TokenPair): void {
    this.authTokens = tokens;

    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(this.TOKEN_STORAGE_KEY, JSON.stringify(tokens));

        // Also store user role for fallback when tokens are expired
        try {
          const payload = JSON.parse(atob(tokens.access_token.split(".")[1]));
          if (payload.role) {
            localStorage.setItem("user_role", payload.role);
            console.log("setTokens: Stored user role:", payload.role);
          }
        } catch (error) {
          console.log("setTokens: Could not extract role from access token");
        }
      } catch (error) {
        console.error("Failed to save tokens to localStorage:", error);
      }
    }
  }

  /**
   * Retrieve authentication tokens from memory or localStorage
   * @returns The stored tokens or null if none exist
   */
  static getTokens(): TokenPair | null {
    // Return cached tokens if available
    if (this.authTokens) {
      return this.authTokens;
    }

    // Try to load from localStorage on client side
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(this.TOKEN_STORAGE_KEY);
        if (stored) {
          this.authTokens = JSON.parse(stored);
          return this.authTokens;
        }
      } catch (error) {
        console.error("Failed to parse stored tokens:", error);
        this.clearTokens();
      }
    }

    return null;
  }

  /**
   * Clear authentication tokens from memory and localStorage
   */
  static clearTokens(): void {
    this.authTokens = null;

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(this.TOKEN_STORAGE_KEY);
        localStorage.removeItem("user_role");
        console.log("clearTokens: Cleared tokens and user role");
      } catch (error) {
        console.error("Failed to clear tokens from localStorage:", error);
      }
    }
  }

  /**
   * Check if the given tokens are expired
   * @param tokens - The tokens to check
   * @returns True if tokens are expired
   */
  static isTokenExpired(tokens: TokenPair): boolean {
    try {
      // Decode the JWT payload without verification (for expiry check only)
      const payload = JSON.parse(atob(tokens.access_token.split(".")[1]));
      const fiveMinutes = 300; // 5 minute buffer in seconds - refresh 5 min before expiry
      return Date.now() / 1000 >= payload.exp - fiveMinutes;
    } catch {
      return true; // If we can't decode, assume expired
    }
  }

  /**
   * Check if user is currently authenticated with valid tokens
   * @returns True if user has valid authentication
   */
  static isAuthenticated(): boolean {
    const tokens = this.getTokens();
    return tokens !== null && !this.isTokenExpired(tokens);
  }

  // ===========================================
  // TOKEN REFRESH LOGIC
  // ===========================================

  /**
   * Refresh expired tokens using the refresh token
   * This method includes logic to prevent multiple simultaneous refresh attempts
   * @returns Promise that resolves to new tokens
   * @throws Error if refresh fails
   */
  private static async refreshTokens(): Promise<TokenPair> {
    // If refresh is already in progress, wait for it
    if (this.refreshPromise) {
      console.log("refreshTokens: Refresh already in progress, waiting...");
      return this.refreshPromise;
    }

    const tokens = this.getTokens();
    if (!tokens?.refresh_token) {
      console.log("refreshTokens: No refresh token available");
      throw new Error("No refresh token available");
    }

    // Check if refresh token is expired
    try {
      const refreshPayload = JSON.parse(
        atob(tokens.refresh_token.split(".")[1])
      );
      if (Date.now() / 1000 >= refreshPayload.exp) {
        console.log("refreshTokens: Refresh token is expired");
        this.clearTokens();
        throw new Error("Refresh token expired");
      }
    } catch (error) {
      console.log("refreshTokens: Invalid refresh token");
      this.clearTokens();
      throw new Error("Invalid refresh token");
    }

    console.log("refreshTokens: Starting token refresh process");

    // Start the refresh process
    this.refreshPromise = this.performTokenRefresh(
      tokens.refresh_token
    ).finally(() => {
      // Clear the promise when done (success or failure)
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  /**
   * Perform the actual token refresh API call
   * @param refreshToken - The refresh token to use
   * @returns Promise that resolves to new tokens
   */
  private static async performTokenRefresh(
    refreshToken: string
  ): Promise<TokenPair> {
    try {
      console.log("performTokenRefresh: Starting token refresh");

      // Determine user type from current tokens to use correct refresh endpoint
      const currentTokens = this.getTokens();
      const userRole = this.getCurrentUserRole();

      console.log("performTokenRefresh: User role:", userRole);
      console.log(
        "performTokenRefresh: Current tokens exist:",
        !!currentTokens
      );

      let refreshEndpoint: string;
      switch (userRole) {
        case "admin":
          refreshEndpoint = "/auth/admin/refresh-token";
          break;
        case "professor":
          refreshEndpoint = "/auth/professor/refresh-token";
          break;
        case "student":
          refreshEndpoint = "/auth/student/refresh-token";
          break;
        default:
          // Fallback to student endpoint if role is unknown
          console.log(
            "performTokenRefresh: Unknown role, defaulting to student endpoint"
          );
          refreshEndpoint = "/auth/student/refresh-token";
      }

      console.log("performTokenRefresh: Using endpoint:", refreshEndpoint);
      console.log(
        "performTokenRefresh: Full URL:",
        `${this.baseURL}${refreshEndpoint}`
      );

      const response = await fetch(`${this.baseURL}${refreshEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      console.log("performTokenRefresh: Response status:", response.status);
      console.log("performTokenRefresh: Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("performTokenRefresh: Response error:", errorText);
        throw new Error(
          `Token refresh failed: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("performTokenRefresh: Response data:", result);

      // Handle Django backend response format
      let tokens: TokenPair;
      if (result.success !== undefined) {
        if (!result.success || !result.data) {
          throw new Error(result.message || "Token refresh failed");
        }
        // Django backend returns { token: TokenPair } in data
        tokens = result.data.token;
      } else {
        // Fallback for non-standard responses
        if (!result.success || !result.data) {
          throw new Error(result.message || "Token refresh failed");
        }
        tokens = result.data.token || result.data;
      }

      console.log("performTokenRefresh: Extracted tokens:", tokens);

      // Store the new tokens
      this.setTokens(tokens);
      console.log("performTokenRefresh: Tokens stored successfully");
      return tokens;
    } catch (error) {
      console.error("performTokenRefresh: Error during refresh:", error);
      // Clear invalid tokens and redirect to login
      this.clearTokens();
      this.redirectToLogin();
      throw error;
    }
  }

  // ===========================================
  // REQUEST MIDDLEWARE LOGIC
  // ===========================================

  /**
   * Main request method that handles all HTTP requests with authentication middleware
   * This is the core of our "middleware" functionality for the frontend
   *
   * @param url - The API endpoint URL
   * @param options - Fetch options
   * @param config - Custom configuration for this request
   * @returns Promise that resolves to typed API response
   */
  private static async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    // Construct full URL
    const fullUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`;

    // Prepare headers
    const headers: Record<string, string> = {
      ...config.headers,
      ...(options.headers as Record<string, string>),
    };

    // Only set Content-Type if not already set (important for FormData which sets its own)
    if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Handle authentication (this is our middleware logic)
    if (config.requiresAuth !== false) {
      const authHeader = await this.getAuthorizationHeader(
        config.skipAuthRefresh
      );
      if (authHeader) {
        headers.Authorization = authHeader;
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = config.timeout
      ? setTimeout(() => controller.abort(), config.timeout)
      : null;

    try {
      // Make the request
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal: controller.signal,
      });

      // Handle authentication errors with retry logic
      if (
        response.status === 401 &&
        config.requiresAuth !== false &&
        !config.skipAuthRefresh
      ) {
        return this.handleUnauthorizedResponse<T>(fullUrl, options);
      }

      // Handle other HTTP errors
      if (!response.ok) {
        throw await this.createApiError(response);
      }

      // Parse and normalize successful response
      const result = await response.json();

      // Handle Django backend response format
      if (result && typeof result === "object" && "success" in result) {
        // Django-like format: {success, data, message, errors}
        if (result.success) {
          return result; // Return standardized shape
        } else {
          const error = new Error(result.message || "Request failed");
          (error as any).code = "API_ERROR";
          (error as any).details = result.errors;
          throw error;
        }
      }

      // Fallback: wrap raw responses (arrays/objects) into standardized ApiResponse
      return {
        success: true,
        data: result,
        message: undefined,
        request_id: crypto?.randomUUID?.() ?? undefined,
        timestamp: new Date().toISOString(),
      } as unknown as ApiResponse<any>;
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        (error as Error).name === "AbortError"
      ) {
        throw new Error("Request timeout");
      }
      throw error;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  /**
   * Get authorization header with automatic token refresh
   * @param skipRefresh - Whether to skip token refresh
   * @returns Authorization header value or null
   */
  private static async getAuthorizationHeader(
    skipRefresh?: boolean
  ): Promise<string | null> {
    let tokens = this.getTokens();

    if (!tokens) {
      this.redirectToLogin();
      throw new Error("Authentication required");
    }

    // Check if token needs refresh
    if (this.isTokenExpired(tokens) && !skipRefresh) {
      try {
        tokens = await this.refreshTokens();
      } catch (error) {
        this.redirectToLogin();
        throw error;
      }
    }

    return `Bearer ${tokens.access_token}`;
  }

  /**
   * Handle 401 unauthorized responses with token refresh retry
   * @param url - Original request URL
   * @param options - Original request options
   * @returns Promise that resolves to API response
   */
  private static async handleUnauthorizedResponse<T>(
    url: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      // Try to refresh tokens
      await this.refreshTokens();

      // Retry the original request with new tokens
      const authHeader = await this.getAuthorizationHeader(true); // Skip refresh on retry
      const retryOptions = {
        ...options,
        headers: {
          ...options.headers,
          ...(authHeader && { Authorization: authHeader }),
        },
      };

      const retryResponse = await fetch(url, retryOptions);

      if (retryResponse.ok) {
        return await retryResponse.json();
      } else {
        throw await this.createApiError(retryResponse);
      }
    } catch (error) {
      this.redirectToLogin();
      throw error;
    }
  }

  /**
   * Create a standardized API error from a fetch response
   * @param response - The failed fetch response
   * @returns Promise that resolves to ApiError
   */
  private static async createApiError(response: Response): Promise<ApiError> {
    const error: ApiError = {
      message: `HTTP ${response.status}: ${response.statusText}`,
      status: response.status,
    };

    try {
      const errorData = await response.json();
      error.message = errorData.message || error.message;
      error.code = errorData.code;
      error.details = errorData.details || errorData.errors;
      // Include the full response data for special error handling
      (error as any).data = errorData;
    } catch {
      // Response is not JSON, use default error message
    }

    return error;
  }

  // ===========================================
  // HTTP METHODS
  // ===========================================

  /**
   * Make a GET request
   * @param url - The endpoint URL
   * @param config - Request configuration
   * @returns Promise that resolves to typed response
   */
  protected static async get<T>(
    url: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: "GET" }, config);
  }

  /**
   * Make a POST request
   * @param url - The endpoint URL
   * @param data - Data to send in request body
   * @param config - Request configuration
   * @returns Promise that resolves to typed response
   */
  protected static async post<T>(
    url: string,
    data?: unknown,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : data ? JSON.stringify(data) : undefined;
    const headers: Record<string, string> = isFormData
      ? {}
      : { "Content-Type": "application/json" };

    return this.makeRequest<T>(
      url,
      { method: "POST", body },
      { ...config, headers: { ...headers, ...config.headers } }
    );
  }

  /**
   * Make a PUT request
   * @param url - The endpoint URL
   * @param data - Data to send in request body
   * @param config - Request configuration
   * @returns Promise that resolves to typed response
   */
  protected static async put<T>(
    url: string,
    data?: unknown,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : data ? JSON.stringify(data) : undefined;
    const headers: Record<string, string> = isFormData
      ? {}
      : { "Content-Type": "application/json" };

    return this.makeRequest<T>(
      url,
      { method: "PUT", body },
      { ...config, headers: { ...headers, ...config.headers } }
    );
  }

  /**
   * Make a DELETE request
   * @param url - The endpoint URL
   * @param config - Request configuration
   * @returns Promise that resolves to typed response
   */
  protected static async delete<T>(
    url: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: "DELETE" }, config);
  }

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  /**
   * Redirect user to login page
   * Only works on client side
   */
  private static redirectToLogin(): void {
    if (typeof window !== "undefined") {
      // Store the current page to redirect back after login
      const currentPath = window.location.pathname;
      if (currentPath !== "/auth/login" && currentPath !== "/auth/register") {
        sessionStorage.setItem("redirect_after_login", currentPath);
      }

      window.location.href = "/auth/login";
    }
  }

  /**
   * Execute callback only if user is authenticated, otherwise redirect to login
   * @param callback - Function to execute if authenticated
   */
  static requiresAuth(callback: () => void): void {
    if (!this.isAuthenticated()) {
      this.redirectToLogin();
      return;
    }
    callback();
  }

  /**
   * Get the current user's role from stored user data
   * @returns User role or null if not authenticated
   */
  static getCurrentUserRole(): UserRole | null {
    // First try to get role from access token
    const tokens = this.getTokens();
    if (tokens?.access_token) {
      try {
        // Decode JWT payload to get user role
        const payload = JSON.parse(atob(tokens.access_token.split(".")[1]));
        if (payload.role) {
          return payload.role;
        }
      } catch (error) {
        console.log(
          "getCurrentUserRole: Could not decode access token, trying refresh token"
        );
      }
    }

    // If access token fails, try refresh token
    if (tokens?.refresh_token) {
      try {
        // Decode refresh token payload to get user role
        const payload = JSON.parse(atob(tokens.refresh_token.split(".")[1]));
        if (payload.role) {
          return payload.role;
        }
      } catch (error) {
        console.log("getCurrentUserRole: Could not decode refresh token");
      }
    }

    // Fallback: try to get from localStorage
    if (typeof window !== "undefined") {
      try {
        // First try the stored user role
        const storedRole = localStorage.getItem("user_role");
        if (storedRole) {
          console.log("getCurrentUserRole: Found stored role:", storedRole);
          return storedRole as UserRole;
        }

        // Then try user data
        const storedUserData = localStorage.getItem("user_data");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          if (userData.role) {
            return userData.role;
          }
        }
      } catch (error) {
        console.log("getCurrentUserRole: Could not get role from localStorage");
      }
    }

    console.log("getCurrentUserRole: No role found in any token or storage");
    return null;
  }

  /**
   * Check if current user has specific role
   * @param role - Role to check
   * @returns True if user has the specified role
   */
  static hasRole(role: UserRole): boolean {
    return this.getCurrentUserRole() === role;
  }
}
