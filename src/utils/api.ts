// ===========================================
// SIMPLE API UTILITY
// ===========================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  request_id?: string;
  timestamp?: string;
}

// ===========================================
// API FUNCTIONS
// ===========================================

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    return {
      success: response.ok,
      data: data.data,
      message: data.message,
      request_id: data.request_id,
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error("API Request failed:", error);
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
}

// ===========================================
// AUTH API
// ===========================================

export const authApi = {
  async loginStudent(email: string, password: string) {
    return apiRequest("/auth/student/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async loginProfessor(email: string, password: string) {
    return apiRequest("/auth/professor/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async loginAdmin(email: string, password: string) {
    return apiRequest("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
};

// ===========================================
// MODULES API
// ===========================================

export const modulesApi = {
  async getAllModules() {
    return apiRequest("/courses/module");
  },

  async getModuleById(id: string) {
    return apiRequest(`/courses/module/${id}`);
  },
};

// ===========================================
// CHAPTERS API
// ===========================================

export const chaptersApi = {
  async getChapterById(id: string) {
    // Clean the chapter ID (remove "Chapter:" prefix if present)
    const cleanId = id.startsWith("Chapter:") ? id.replace("Chapter:", "") : id;
    return apiRequest(`/courses/chapter/${cleanId}`);
  },

  async getChapterWithModuleAndStream(id: string) {
    // Clean the chapter ID (remove "Chapter:" prefix if present)
    const cleanId = id.startsWith("Chapter:") ? id.replace("Chapter:", "") : id;
    // Use the same endpoint as getChapterById since the backend already includes module and stream data
    return apiRequest(`/courses/chapter/${cleanId}`);
  },
};
