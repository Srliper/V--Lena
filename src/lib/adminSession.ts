export const ADMIN_SESSION_KEY = "volena_admin_token";

export function dispatchAdminAuthChange(): void {
  window.dispatchEvent(new Event("volena-admin-auth"));
}

export function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_SESSION_KEY);
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(ADMIN_SESSION_KEY, token);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
