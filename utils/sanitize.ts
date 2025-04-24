// utils/sanitize.ts
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';


// Create a DOM environment for server-side use
const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * @param html - The raw HTML string to sanitize.
 * @returns The sanitized HTML string.
 */
export function sanitizeHtml(html: string): string {
  return purify.sanitize(html);
}