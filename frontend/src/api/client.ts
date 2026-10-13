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
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

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
