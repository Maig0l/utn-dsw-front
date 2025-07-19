// src/environments/environment.ts (desarrollo)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
};

/**
 * Devuelve un link válido para un archivo, sin importar que esté guardado en nuestro "bucket"
 * o que sea un hotlink (archivo externo)
 * @param value Nombre del archivo en el bucket, o URL externa
 */
export function linkToStaticResource(value: string | undefined) {
  const localStorageLocation = `${environment.apiUrl}/uploads`;

  if (!value) return '';

  const isExternalRegex = /^https?:\/\//;
  const isExternal = isExternalRegex.test(value);
  if (isExternal) return value;

  // Si el valor ya comienza con '/uploads/', solo agregar el apiUrl
  if (value.startsWith('/uploads/')) {
    return `${environment.apiUrl}${value}`;
  }

  // Si no, agregar la ruta completa
  return `${localStorageLocation}/${value}`;
}
