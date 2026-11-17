/** Public links must never use Next's internal reverse-proxy bind address. */
export function publicSiteUrl(path: string): string {
  const origin = new URL(process.env.SITE_URL || 'https://infaithjourney.com');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname);
  if (origin.username || origin.password || origin.hostname === '0.0.0.0'
    || (origin.protocol !== 'https:' && !(local && process.env.NODE_ENV !== 'production' && origin.protocol === 'http:'))
    || (local && process.env.NODE_ENV === 'production')) {
    throw new Error('SITE_URL must be the public HTTPS website address.');
  }
  const result = new URL(path, origin.origin);
  if (result.origin !== origin.origin) throw new Error('Public links must stay on SITE_URL.');
  return result.href;
}
