export const environment = {
  production: true,
  apiUrl: import.meta.env.NG_APP_API_URL || import.meta.env.API_URL || 'http://localhost:8080/api',
};
