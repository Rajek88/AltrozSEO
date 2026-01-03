/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  if (!text) return "";
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Helper function to get first item if array
 */
export function getFirstItem<T>(item: T | T[] | undefined): T | undefined {
  if (!item) return undefined;
  return Array.isArray(item) ? item[0] : item;
}
