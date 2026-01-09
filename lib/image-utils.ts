// Funcoes de utilidade para imagens - podem ser usadas em Client Components
// NAO importa o SDK cloudinary (que usa Node.js fs)

/**
 * Gera blur placeholder URL do Cloudinary
 * Transforma URL para versao tiny blur (10px, qualidade 10)
 */
export function getBlurUrl(url: string): string {
  if (!url) return '';
  
  // So funciona com URLs do Cloudinary
  if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary.com')) {
    return '';
  }
  
  // Transforma URL para versao blur (10px, qualidade 10)
  const parts = url.split('/upload/');
  if (parts.length !== 2) return '';
  
  return `${parts[0]}/upload/w_10,q_10,f_jpg/${parts[1]}`;
}

/**
 * Gera placeholder blur para Unsplash (fallback)
 */
export function getUnsplashBlurUrl(url: string): string {
  if (!url) return '';
  
  if (!url.includes('unsplash.com')) {
    return '';
  }
  
  // Adiciona parametros de blur do Unsplash
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=10&q=10&blur=20`;
}

/**
 * Helper para obter blur URL de qualquer fonte (Cloudinary ou Unsplash)
 */
export function getImageBlurUrl(url: string): string {
  if (!url) return '';
  
  const cloudinaryBlur = getBlurUrl(url);
  if (cloudinaryBlur) return cloudinaryBlur;
  
  const unsplashBlur = getUnsplashBlurUrl(url);
  if (unsplashBlur) return unsplashBlur;
  
  return '';
}

