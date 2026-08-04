// ============================================================================
// LightPanel Full-Stack API Client
// Connects Frontend to Node.js TypeScript REST API (/api/v1) with JWT & WebSocket support
// ============================================================================

import type {
  SystemStats,
  Application,
  Website,
  DatabaseExtended,
  SSLCertificate,
  Mailbox,
  EmailDomain,
  EmailAlias,
  MailMessage,
  ApiResponse,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

let jwtToken: string | null = typeof window !== 'undefined' ? localStorage.getItem('lightpanel_token') : null;

export function setAuthToken(token: string) {
  jwtToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('lightpanel_token', token);
  }
}

export function clearAuthToken() {
  jwtToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('lightpanel_token');
  }
}

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }
  return headers;
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
        ...options.headers,
      },
    });

    if (response.status === 401) {
      clearAuthToken();
      return { success: false, error: 'Authentication required' };
    }

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = `HTTP ${response.status}`;
      try {
        const json = JSON.parse(text);
        if (json.error) errorMessage = json.error;
      } catch (e) {
        if (text) errorMessage = text;
      }
      return { success: false, error: errorMessage };
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const json = await response.json();
      return { success: true, data: json.data || json };
    }

    return { success: true, data: undefined as unknown as T };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network connection failure',
    };
  }
}

// System Health & Stats
export async function fetchSystemStats(): Promise<ApiResponse<SystemStats>> {
  return apiRequest<SystemStats>('/api/v1/resources/stats');
}

// Workload Applications
export async function fetchApplications(): Promise<ApiResponse<Application[]>> {
  return apiRequest<Application[]>('/api/v1/resources/apps');
}

export async function createApplication(appData: Partial<Application>): Promise<ApiResponse<Application>> {
  return apiRequest<Application>('/api/v1/resources/apps', {
    method: 'POST',
    body: JSON.stringify(appData),
  });
}

export async function deleteApplication(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/v1/resources/apps/${id}`, {
    method: 'DELETE',
  });
}

// Websites & Hosting
export async function fetchWebsites(): Promise<ApiResponse<Website[]>> {
  return apiRequest<Website[]>('/api/v1/resources/websites');
}

export async function createWebsite(websiteData: Partial<Website>): Promise<ApiResponse<Website>> {
  return apiRequest<Website>('/api/v1/resources/websites', {
    method: 'POST',
    body: JSON.stringify(websiteData),
  });
}

export async function deleteWebsite(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/v1/resources/websites/${id}`, {
    method: 'DELETE',
  });
}

// Database Provisioning
export async function fetchDatabases(): Promise<ApiResponse<DatabaseExtended[]>> {
  return apiRequest<DatabaseExtended[]>('/api/v1/resources/databases');
}

export async function createDatabase(dbData: Partial<DatabaseExtended>): Promise<ApiResponse<DatabaseExtended>> {
  return apiRequest<DatabaseExtended>('/api/v1/resources/databases', {
    method: 'POST',
    body: JSON.stringify(dbData),
  });
}

export async function deleteDatabase(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/v1/resources/databases/${id}`, {
    method: 'DELETE',
  });
}

// SSL / TLS Certificates
export async function fetchSSLCertificates(): Promise<ApiResponse<SSLCertificate[]>> {
  return apiRequest<SSLCertificate[]>('/api/v1/resources/ssl');
}

export async function issueSSLCertificate(domain: string): Promise<ApiResponse<SSLCertificate>> {
  return apiRequest<SSLCertificate>('/api/v1/resources/ssl/issue', {
    method: 'POST',
    body: JSON.stringify({ domain }),
  });
}

// Email Domains & Mailboxes
export async function fetchEmailDomains(): Promise<ApiResponse<EmailDomain[]>> {
  return apiRequest<EmailDomain[]>('/api/v1/email/domains');
}

export async function fetchMailboxes(): Promise<ApiResponse<Mailbox[]>> {
  return apiRequest<Mailbox[]>('/api/v1/email/mailboxes');
}

export async function createMailbox(mailboxData: Partial<Mailbox>): Promise<ApiResponse<Mailbox>> {
  return apiRequest<Mailbox>('/api/v1/email/mailboxes', {
    method: 'POST',
    body: JSON.stringify(mailboxData),
  });
}

export async function fetchWebmailInbox(): Promise<ApiResponse<MailMessage[]>> {
  return apiRequest<MailMessage[]>('/api/v1/email/webmail/inbox');
}

export async function sendWebmailMessage(msgData: Partial<MailMessage>): Promise<ApiResponse<void>> {
  return apiRequest<void>('/api/v1/email/webmail/send', {
    method: 'POST',
    body: JSON.stringify(msgData),
  });
}

// Analytics Engine
export async function fetchAnalyticsData(domain?: string): Promise<ApiResponse<any>> {
  const query = domain ? `?domain=${encodeURIComponent(domain)}` : '';
  return apiRequest<any>(`/api/v1/analytics${query}`);
}

// Setup & Installation Status
export async function fetchSetupStatus(): Promise<ApiResponse<{ isConfigured: boolean; currentStep: number }>> {
  return apiRequest<{ isConfigured: boolean; currentStep: number }>('/api/v1/setup/status');
}

export async function submitSetupWizard(setupData: any): Promise<ApiResponse<void>> {
  return apiRequest<void>('/api/v1/setup/finish', {
    method: 'POST',
    body: JSON.stringify(setupData),
  });
}
