import type { 
  ApiResponse, 
  TokenPair, 
  ApiRequestConfig, 
  ApiError,
  UserRole
} from '@/types/api';

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
  protected static readonly baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  
  static {
    console.log('🔧 BaseApi initialized with URL:', this.baseURL);
  }
  
  /** Current authentication tokens */
  private static authTokens: TokenPair | null = null;
  
  /** Promise to prevent multiple simultaneous token refresh attempts */
  private static refreshPromise: Promise<TokenPair> | null = null;
  
  /** Key used for localStorage token storage */
  private static readonly TOKEN_STORAGE_KEY = 'sauvini_auth_tokens';

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
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.TOKEN_STORAGE_KEY, JSON.stringify(tokens));
      } catch (error) {
        console.error('Failed to save tokens to localStorage:', error);
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
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.TOKEN_STORAGE_KEY);
        if (stored) {
          this.authTokens = JSON.parse(stored);
          return this.authTokens;
        }
      } catch (error) {
        console.error('Failed to parse stored tokens:', error);
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
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.TOKEN_STORAGE_KEY);
      } catch (error) {
        console.error('Failed to clear tokens from localStorage:', error);
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
      const payload = JSON.parse(atob(tokens.access_token.split('.')[1]));
      const thirtySeconds = 30; // 30 second buffer in seconds
      return Date.now() / 1000 >= (payload.exp - thirtySeconds);
    } catch {
      return true; // If we can't decode, assume expired
    }
  }

  /**
   * Get authentication status with detailed information
   * @returns Object containing authentication state details
   */
  static getAuthStatus(): {
    isAuthenticated: boolean;
    hasTokens: boolean;
    isExpired: boolean;
    needsRefresh: boolean;
  } {
    const tokens = this.getTokens();
    
    if (!tokens) {
      return {
        isAuthenticated: false,
        hasTokens: false,
        isExpired: false,
        needsRefresh: false,
      };
    }

    const isExpired = this.isTokenExpired(tokens);
    
    return {
      isAuthenticated: !isExpired,
      hasTokens: true,
      isExpired,
      needsRefresh: isExpired && !!tokens.refresh_token,
    };
  }

  /**
   * Check if user is currently authenticated with valid tokens
   * @returns True if user has valid (non-expired) tokens
   */
  static isAuthenticated(): boolean {
    const tokens = this.getTokens();
    return tokens !== null && !this.isTokenExpired(tokens);
  }

  /**
   * Check if user has tokens (regardless of expiration)
   * @returns True if tokens exist
   */
  static hasTokens(): boolean {
    return this.getTokens() !== null;
  }

  /**
   * Check if user needs token refresh
   * @returns True if tokens exist but are expired and refresh token is available
   */
  static needsTokenRefresh(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return false;
    return this.isTokenExpired(tokens) && !!tokens.refresh_token;
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
  static async refreshTokens(): Promise<TokenPair> {
    // If refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const tokens = this.getTokens();
    if (!tokens?.refresh_token) {
      const error = new Error('No refresh token available');
      this.clearTokens();
      this.redirectToLogin();
      throw error;
    }

    // Start the refresh process
    this.refreshPromise = this.performTokenRefresh(tokens.refresh_token)
      .finally(() => {
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
  private static async performTokenRefresh(refreshToken: string): Promise<TokenPair> {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data: ApiResponse<TokenPair> = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Token refresh failed');
      }

      // Store the new tokens
      this.setTokens(data.data);
      return data.data;

    } catch (error) {
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
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    // Check if body is FormData (important for multipart/form-data)
    const isFormData = options.body instanceof FormData;
    
    // Add detailed logging for debugging
    console.log('🌐 Making API Request:', {
      method: options.method || 'GET',
      url: fullUrl,
      hasBody: !!options.body,
      bodyType: options.body ? typeof options.body : 'none',
      isFormData,
      config,
      timestamp: new Date().toISOString()
    });
    
    // Prepare headers
    // IMPORTANT: For FormData, DO NOT set Content-Type - let browser set it with boundary
    const headers: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...config.headers,
      ...(options.headers as Record<string, string>),
    };

    // Handle authentication (this is our middleware logic)
    if (config.requiresAuth !== false) {
      try {
        const authHeader = await this.getAuthorizationHeader(config.skipAuthRefresh);
        headers.Authorization = authHeader;
      } catch (error) {
        console.error('Failed to get authorization header:', error);
        throw error;
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

      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        url: fullUrl,
        ok: response.ok,
        timestamp: new Date().toISOString()
      });

      // Handle authentication errors with retry logic
      if (response.status === 401 && config.requiresAuth !== false && !config.skipAuthRefresh) {
        console.log('🔐 Handling 401 - attempting token refresh');
        return this.handleUnauthorizedResponse<T>(fullUrl, options);
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const apiError = await this.createApiError(response);
        console.error('❌ HTTP Error:', apiError);
        throw apiError;
      }

      // Parse and return successful response
      const responseData = await response.json();
      console.log('✅ Successful response:', responseData);
      return responseData;

    } catch (error) {
      console.error('🔥 Request failed:', {
        url: fullUrl,
        error,
        timestamp: new Date().toISOString()
      });
      
      if (typeof error === 'object' && error !== null && 'name' in error && (error as Error).name === 'AbortError') {
        console.error('⏱️ Request timeout');
        throw new Error('Request timeout');
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
   * @returns Authorization header value
   * @throws Error if authentication fails
   */
  private static async getAuthorizationHeader(skipRefresh?: boolean): Promise<string> {
    let tokens = this.getTokens();
    
    if (!tokens) {
      this.clearTokens();
      this.redirectToLogin();
      throw new Error('Authentication required');
    }

    // Check if token needs refresh
    if (this.isTokenExpired(tokens) && !skipRefresh) {
      try {
        const refreshedTokens = await this.refreshTokens();
        this.setTokens(refreshedTokens);
        tokens = refreshedTokens;
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.clearTokens();
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
      console.log('🔄 Attempting to refresh tokens and retry request...');
      
      // Try to refresh tokens
      const refreshedTokens = await this.refreshTokens();
      this.setTokens(refreshedTokens);
      
      // Retry the original request with new tokens
      const authHeader = await this.getAuthorizationHeader(true); // Skip refresh on retry
      const retryOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: authHeader,
        },
      };

      const retryResponse = await fetch(url, retryOptions);
      
      if (retryResponse.ok) {
        const data = await retryResponse.json();
        console.log('✅ Retry successful after token refresh');
        return data;
      } else {
        const apiError = await this.createApiError(retryResponse);
        console.error('❌ Retry failed after token refresh:', apiError);
        throw apiError;
      }
      
    } catch (error) {
      console.error('🔥 Token refresh and retry failed:', error);
      // this.clearTokens();
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
    return this.makeRequest<T>(url, { method: 'GET' }, config);
  }

  /**
   * Make a POST request
   * @param url - The endpoint URL
   * @param data - Data to send in request body (JSON object or FormData for file uploads)
   * @param config - Request configuration
   * @returns Promise that resolves to typed response
   * 
   * Note: For FormData, Content-Type header is automatically set by the browser
   * with the correct multipart/form-data boundary. Do not manually set it.
   */
  protected static async post<T>(
    url: string,
    data?: unknown,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : (data ? JSON.stringify(data) : undefined);
    // For FormData, use empty headers - browser will set Content-Type with boundary
    const headers: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' };
    
    return this.makeRequest<T>(
      url,
      { method: 'POST', body },
      { ...config, headers: { ...headers, ...config.headers } }
    );
  }

  /**
   * Make a PUT request
   * @param url - The endpoint URL
   * @param data - Data to send in request body (JSON object or FormData for file uploads)
   * @param config - Request configuration
   * @returns Promise that resolves to typed response
   * 
   * Note: For FormData, Content-Type header is automatically set by the browser
   * with the correct multipart/form-data boundary. Do not manually set it.
   */
  protected static async put<T>(
    url: string,
    data?: unknown,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : (data ? JSON.stringify(data) : undefined);
    // For FormData, use empty headers - browser will set Content-Type with boundary
    const headers: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' };
    
    return this.makeRequest<T>(
      url,
      { method: 'PUT', body },
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
    return this.makeRequest<T>(url, { method: 'DELETE' }, config);
  }

  // ===========================================
  // UTILITY METHODS
  // ===========================================

  /**
   * Redirect user to login page
   * Only works on client side
   */
  private static redirectToLogin(): void {
    console.log("Redirecting to login...");
    // if (typeof window !== 'undefined') {
    //   // Store the current page to redirect back after login
    //   const currentPath = window.location.pathname;
    //   if (currentPath !== '/auth/login' && currentPath !== '/auth/register') {
    //     sessionStorage.setItem('redirect_after_login', currentPath);
    //   }
      
    //   window.location.href = '/auth/select-role';
    // }
  }

  /**
   * Execute callback only if user is authenticated, otherwise try to refresh or redirect to login
   * @param callback - Function to execute if authenticated
   */
  static async requiresAuth(callback: () => void | Promise<void>): Promise<void> {
    const authStatus = this.getAuthStatus();
    
    // If no tokens at all, redirect to login
    if (!authStatus.hasTokens) {
      this.clearTokens();
      this.redirectToLogin();
      return;
    }
    
    // If tokens are expired but can be refreshed
    if (authStatus.needsRefresh) {
      try {
        console.log('🔄 Tokens expired, refreshing before execution...');
        const refreshedTokens = await this.refreshTokens();
        this.setTokens(refreshedTokens);
        console.log('✅ Tokens refreshed successfully');
      } catch (error) {
        console.error('❌ Token refresh failed:', error);
        this.clearTokens();
        this.redirectToLogin();
        return;
      }
    }
    
    // If tokens are expired and cannot be refreshed, redirect to login
    if (authStatus.isExpired && !authStatus.needsRefresh) {
      this.clearTokens();
      this.redirectToLogin();
      return;
    }
    
    // User is authenticated, execute callback
    await callback();
  }

  /**
   * Get the current user's role from stored tokens
   * @returns User role or null if not authenticated
   */
  static getCurrentUserRole(): UserRole | null {
    const tokens = this.getTokens();
    if (!tokens?.access_token) return null;
    
    try {
      // Decode JWT payload to get user role
      const payload = JSON.parse(atob(tokens.access_token.split('.')[1]));
      console.log('Decoded JWT payload:', payload);
      return payload.role || null;
    } catch {
      return null;
    }
  }

  static getStudentSub(): string | null {
    const tokens = this.getTokens();
    if (!tokens?.access_token) return null;
    
    try {
      // Decode JWT payload to get user role
      const payload = JSON.parse(atob(tokens.access_token.split('.')[1]));
      console.log('Decoded JWT payload:', payload);
      return payload.sub || null;
    } catch {
      return null;
    }
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