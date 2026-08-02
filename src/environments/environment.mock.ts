// Reemplazo de environment.ts/enviroment.ts usado sólo bajo Jest (ver jest.config.js moduleNameMapper).
// import.meta.env es sintaxis ESM y ts-jest transpila los specs a CommonJS, así que no se puede
// usar el archivo real en los tests; este mock expone la misma forma leyendo de process.env.
export const environment = {
  production: false,
  apiUrl: process.env['NG_APP_API_URL'] || process.env['API_URL'] || 'http://localhost:8080/api',
};
