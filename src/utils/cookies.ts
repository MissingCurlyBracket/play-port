export const getRegionFromCookie = (): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )region=([^;]+)'));
  return match ? match[2] : undefined;
};

export const getProvidersFromCookie = (): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )providers=([^;]+)'));
  return match ? match[2] : undefined;
};
