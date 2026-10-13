const API_BASE = 'http://localhost:3000';

export type AuthUser = { id: number; email: string; name: string; role: 'Manager' | 'Inspector' };

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!response.ok) throw new Error(await errorMessage(response));
  return response.json();
}

// NestJS errors look like { statusCode, message, error }; message can be a string or a list of validation errors.
async function errorMessage(response: Response): Promise<string> {
  const text = await response.text();
  try {
    const body = JSON.parse(text);
    if (Array.isArray(body.message)) return body.message.join(', ');
    if (typeof body.message === 'string') return body.message;
  } catch {
    // not JSON, fall through
  }
  return text || `Request failed (${response.status})`;
}

// ---- Inspections ----

export type InspectionStatus = 'Yet to Start' | 'Completed';
export type InspectionResult = 'Pass' | 'Fail';
type Ref = { id: number; name: string };

export type Inspection = {
  id: number;
  title: string;
  status: InspectionStatus;
  createdBy: Ref | null;
  assignedInspector: Ref | null;
  location: Ref | null;
  startedAt: string | null;
  durationMinutes: number | null;
  result: InspectionResult | null;
  comments: string | null;
  completedAt: string | null;
  createdAt: string;
};

export type CompleteInspectionInput = {
  locationId: number;
  startedAt: string; // ISO 8601
  durationMinutes: number;
  result: InspectionResult;
  comments: string;
};

export const listInspections = () => api<Inspection[]>('/inspections');

export const createInspection = (title: string) =>
  api<Inspection>('/inspections', { method: 'POST', body: JSON.stringify({ title }) });

export const assignInspection = (id: number, inspectorId: number) =>
  api<Inspection>(`/inspections/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ inspectorId }) });

export const completeInspection = (id: number, input: CompleteInspectionInput) =>
  api<Inspection>(`/inspections/${id}/complete`, { method: 'PATCH', body: JSON.stringify(input) });

export const listInspectors = () => api<Ref[]>('/users/inspectors');

export async function login(email: string, password: string) {
  const result = await api<{ accessToken: string; user: AuthUser }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  localStorage.setItem('token', result.accessToken);
  localStorage.setItem('user', JSON.stringify(result.user));
  return result.user;
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
