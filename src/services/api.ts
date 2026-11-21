import { Complaint, ComplaintStatus, CitizenVerification } from '../types/complaint';

/**
 * Resolves the API base URL.
 * Ensures mobile devices on LAN do not call their own local device when VITE_API_URL contains 'localhost'.
 * By default, uses relative '/api' which works seamlessly with Vite proxy in development
 * and Express static hosting in production.
 */
export function getApiBaseUrl(): string {
  const envUrl = ((import.meta as any).env?.VITE_API_URL as string | undefined)?.trim();
  if (envUrl) {
    try {
      const url = new URL(envUrl, window.location.origin);
      // If VITE_API_URL points to localhost/127.0.0.1 but the current browser is running on a LAN IP
      if (
        (url.hostname === 'localhost' || url.hostname === '127.0.0.1') &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1'
      ) {
        url.hostname = window.location.hostname;
      }
      return url.toString().replace(/\/$/, '');
    } catch {
      return envUrl;
    }
  }

  // Relative URL matches the origin of the current device's session (e.g. http://192.168.1.3:5173/api)
  return '/api';
}

export async function fetchComplaints(): Promise<Complaint[]> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/complaints`);
  if (!res.ok) {
    throw new Error(`Failed to fetch complaints: ${res.statusText}`);
  }
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.complaints)) return data.complaints;
  return [];
}

export async function fetchComplaintById(id: string): Promise<Complaint | null> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/complaints/${encodeURIComponent(id)}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch complaint: ${res.statusText}`);
  }
  const data = await res.json();
  return data.complaint || data;
}

export async function createComplaintApi(complaint: Partial<Complaint>): Promise<Complaint> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(complaint),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to create complaint: ${res.statusText}`);
  }
  const data = await res.json();
  return data.complaint || data;
}

export async function updateComplaintStatusApi(
  id: string,
  status: ComplaintStatus,
  note?: string,
  actor: string = 'Municipal Officer'
): Promise<Complaint | null> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/complaints/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note, actor }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update status: ${res.statusText}`);
  }
  const data = await res.json();
  return data.complaint || data;
}

export async function verifyResolutionApi(
  id: string,
  verification: CitizenVerification
): Promise<Complaint | null> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/complaints/${encodeURIComponent(id)}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(verification),
  });
  if (!res.ok) {
    throw new Error(`Failed to submit citizen verification: ${res.statusText}`);
  }
  const data = await res.json();
  return data.complaint || data;
}

export async function corroborateComplaintApi(id: string): Promise<Complaint | null> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/complaints/${encodeURIComponent(id)}/corroborate`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error(`Failed to corroborate complaint: ${res.statusText}`);
  }
  const data = await res.json();
  return data.complaint || data;
}

export async function loadDemoComplaintsApi(): Promise<Complaint[]> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/complaints/demo/load`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error(`Failed to load demo complaints: ${res.statusText}`);
  }
  const data = await res.json();
  return data.complaints || [];
}

export async function clearDemoComplaintsApi(): Promise<Complaint[]> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/complaints/demo/clear`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error(`Failed to clear demo complaints: ${res.statusText}`);
  }
  const data = await res.json();
  return data.complaints || [];
}

export async function syncComplaintsApi(complaints: Complaint[]): Promise<Complaint[]> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/complaints/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ complaints }),
  });
  if (!res.ok) {
    throw new Error(`Failed to sync complaints: ${res.statusText}`);
  }
  const data = await res.json();
  return data.complaints || [];
}
