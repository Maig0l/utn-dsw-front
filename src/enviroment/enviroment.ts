// src/environments/environment.ts (desarrollo)

const API_HOST = 'localhost';
const API_PORT = 8080;

export const environment = {
  production: false,
  apiUrl: import.meta.env.NG_APP_API_URL || `http://${API_HOST}:${API_PORT}/api`,
};
