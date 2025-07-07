// src/environments/environment.ts (desarrollo)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
};

export function staticLinkTo(filename: string | undefined) {
  if (!filename) return '';
  return `${environment.apiUrl}/uploads/${filename}`;
}
