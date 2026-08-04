// ============================================================================
// LightPanel API Client
// Connects to the Go backend with HTTP Basic Auth
// ============================================================================

import type {
  SystemStats,
  SiteConfig,
  DatabaseInfo,
  CertInfo,
  CreateSiteForm,
  CreateDatabaseForm,
  ApiResponse,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8443';

// Credentials stored in session, never hardcoded
let credentials: { username: string; password: string } | null = null;

export function setCredentials(username: string, password: string) {
  credentials = { username, password };
}

export function clearCredentials() {
  credentials = null;
}

export function hasCredentials(): boolean {
  return credentials !== null;
}

function getAuthHeaders(): HeadersInit {
  if (!credentials) return {};
  const encoded = btoa(`${credentials.username}:${credentials.password}`);
  return {
    Authorization: `Basic ${encoded}`,
  };
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      return { success: false, error: 'Authentication failed' };
    }

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: text || `HTTP ${response.status}` };
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return { success: true, data };
    }

    return { success: true, data: undefined as unknown as T };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// --- Stats ---
export async function fetchStats(): Promise<ApiResponse<SystemStats>> {
  return apiRequest<SystemStats>('/api/stats');
}

// --- Sites ---
export async function fetchSites(): Promise<ApiResponse<SiteConfig[]>> {
  return apiRequest<SiteConfig[]>('/api/sites');
}

export async function createSite(form: CreateSiteForm): Promise<ApiResponse<void>> {
  const formData = new URLSearchParams();
  formData.append('domain', form.domain);
  formData.append('site_type', form.site_type);
  if (form.php_version) formData.append('php_version', form.php_version);

  return apiRequest<void>('/api/sites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });
}

export async function deleteSite(domain: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/sites?domain=${encodeURIComponent(domain)}`, {
    method: 'DELETE',
  });
}

// --- Databases ---
export async function fetchDatabases(): Promise<ApiResponse<DatabaseInfo[]>> {
  return apiRequest<DatabaseInfo[]>('/api/databases');
}

export async function createDatabase(form: CreateDatabaseForm): Promise<ApiResponse<void>> {
  const formData = new URLSearchParams();
  formData.append('db_name', form.db_name);
  formData.append('db_user', form.db_user);
  formData.append('db_pass', form.db_pass);

  return apiRequest<void>('/api/databases', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });
}

export async function deleteDatabase(name: string, user: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/databases?name=${encodeURIComponent(name)}&user=${encodeURIComponent(user)}`, {
    method: 'DELETE',
  });
}

// --- SSL ---
export async function fetchSSLCertificates(): Promise<ApiResponse<CertInfo[]>> {
  return apiRequest<CertInfo[]>('/api/ssl');
}

export async function issueSSLCertificate(domain: string): Promise<ApiResponse<void>> {
  const formData = new URLSearchParams();
  formData.append('domain', domain);

  return apiRequest<void>('/api/ssl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });
}

export async function revokeSSLCertificate(domain: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/ssl?domain=${encodeURIComponent(domain)}`, {
    method: 'DELETE',
  });
}
