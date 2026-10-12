const replacements: Record<string, string> = {
  "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg": "/assets/brands/samsung.svg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3a/MSI_logo.svg": "/assets/brands/msi.svg",
};

// Existing database entries can still contain the retired external URLs.
export function resolveBrandLogo(url: string): string {
  return replacements[url] || url;
}
