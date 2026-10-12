// Keep previously published CMS articles consistent with the current business.
export function rebrandContent(text: string): string {
  return text
    .replace(/laptap\.in@gmail\.com/gi, "hulumart.com@gmail.com")
    .replace(/https?:\/\/(?:www\.)?laptap\.in/gi, "https://www.hulumart.com")
    .replace(/\b(?:www\.)?laptap\.in\b/gi, "www.hulumart.com")
    .replace(/\blaptap\b/gi, "Hulumart");
}

export function rebrandBlog<T extends object>(post: T): T {
  const result = { ...post };
  for (const key of ["title", "excerpt", "content", "author", "meta_title", "meta_description", "keywords", "featured_image"] as const) {
    if (!(key in result)) continue;
    const value = (result as Record<string, unknown>)[key];
    if (typeof value === "string") (result as Record<string, unknown>)[key] = rebrandContent(value);
    else if (Array.isArray(value)) (result as Record<string, unknown>)[key] = value.map(item => typeof item === "string" ? rebrandContent(item) : item);
  }
  return result;
}
