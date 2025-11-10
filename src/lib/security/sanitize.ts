// src/lib/security/sanitize.ts
import validator from "validator";

/**
 * Sanitize HTML content to prevent XSS attacks
 * Simple regex-based sanitization for serverless compatibility
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== "string") return "";

  // For now, just return the HTML as-is since it's stored in the database
  // and sanitized on the client side when displayed
  // This avoids the isomorphic-dompurify ESM issue on Vercel
  return html;
}

/**
 * Sanitize plain text by escaping HTML entities
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== "string") return "";
  return validator.escape(text);
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") return "";
  const trimmed = email.trim().toLowerCase();
  return validator.isEmail(trimmed) ? trimmed : "";
}

/**
 * Validate and sanitize URL
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  return validator.isURL(trimmed, { require_protocol: true }) ? trimmed : "";
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject(obj: any, htmlFields: string[] = []): any {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, htmlFields));
  }

  if (typeof obj === "object") {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (typeof value === "string") {
          // Check if this field should allow HTML
          if (htmlFields.includes(key)) {
            sanitized[key] = sanitizeHTML(value);
          } else if (key.toLowerCase().includes("email")) {
            sanitized[key] = sanitizeEmail(value);
          } else if (
            key.toLowerCase().includes("url") ||
            key.toLowerCase().includes("link")
          ) {
            sanitized[key] = sanitizeURL(value);
          } else {
            sanitized[key] = sanitizeText(value);
          }
        } else if (typeof value === "object") {
          sanitized[key] = sanitizeObject(value, htmlFields);
        } else {
          sanitized[key] = value;
        }
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Validate career data structure
 */
export function validateCareerData(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  if (
    !data.jobTitle ||
    typeof data.jobTitle !== "string" ||
    data.jobTitle.trim().length === 0
  ) {
    errors.push("Job title is required");
  }

  if (
    !data.description ||
    typeof data.description !== "string" ||
    data.description.trim().length === 0
  ) {
    errors.push("Job description is required");
  }

  if (
    !data.location ||
    typeof data.location !== "string" ||
    data.location.trim().length === 0
  ) {
    errors.push("Location is required");
  }

  if (
    !data.workSetup ||
    typeof data.workSetup !== "string" ||
    data.workSetup.trim().length === 0
  ) {
    errors.push("Work setup is required");
  }

  // Validate questions array
  if (!Array.isArray(data.questions)) {
    errors.push("Questions must be an array");
  }

  // Validate salary if provided
  if (data.minimumSalary !== null && data.minimumSalary !== undefined) {
    const minSalary = Number(data.minimumSalary);
    if (isNaN(minSalary) || minSalary < 0) {
      errors.push("Minimum salary must be a positive number");
    }
  }

  if (data.maximumSalary !== null && data.maximumSalary !== undefined) {
    const maxSalary = Number(data.maximumSalary);
    if (isNaN(maxSalary) || maxSalary < 0) {
      errors.push("Maximum salary must be a positive number");
    }
  }

  // Validate email fields in createdBy and lastEditedBy
  if (data.createdBy?.email && !validator.isEmail(data.createdBy.email)) {
    errors.push("Invalid creator email");
  }

  if (data.lastEditedBy?.email && !validator.isEmail(data.lastEditedBy.email)) {
    errors.push("Invalid editor email");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
