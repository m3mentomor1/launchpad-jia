# Security Utilities

This directory contains security utilities for protecting the application against common vulnerabilities.

## XSS Protection

### Sanitization Functions

The `sanitize.ts` module provides comprehensive input sanitization:

#### `sanitizeHTML(html: string)`

Sanitizes HTML content while preserving safe formatting tags:

- **Allowed tags**: p, br, strong, em, u, h1-h6, ul, ol, li, a, div, span, blockquote, code, pre
- **Allowed attributes**: href, target, rel, class
- **Blocks**: script tags, event handlers, data attributes

```typescript
import { sanitizeHTML } from "@/lib/security/sanitize";

const clean = sanitizeHTML(userInput);
```

#### `sanitizeText(text: string)`

Escapes HTML entities in plain text to prevent XSS:

```typescript
import { sanitizeText } from "@/lib/security/sanitize";

const safe = sanitizeText(userInput);
```

#### `sanitizeEmail(email: string)`

Validates and normalizes email addresses:

```typescript
import { sanitizeEmail } from "@/lib/security/sanitize";

const email = sanitizeEmail(userInput); // Returns "" if invalid
```

#### `sanitizeURL(url: string)`

Validates URLs and ensures they have proper protocols:

```typescript
import { sanitizeURL } from "@/lib/security/sanitize";

const url = sanitizeURL(userInput); // Returns "" if invalid
```

#### `sanitizeObject(obj: any, htmlFields: string[])`

Recursively sanitizes all string fields in an object:

- Plain text fields are escaped
- Fields in `htmlFields` array allow safe HTML
- Email fields are validated
- URL fields are validated

```typescript
import { sanitizeObject } from "@/lib/security/sanitize";

const clean = sanitizeObject(userData, ["description", "bio"]);
```

### Validation

#### `validateCareerData(data: any)`

Validates career data structure and returns validation errors:

```typescript
import { validateCareerData } from "@/lib/security/sanitize";

const { valid, errors } = validateCareerData(careerData);
if (!valid) {
  console.error(errors);
}
```

## API Security

### Add Career Endpoint (`/api/add-career`)

Protected with:

1. **Input validation** - Validates required fields and data types
2. **XSS sanitization** - All inputs sanitized before database insertion
3. **SQL injection protection** - Uses MongoDB ObjectId validation
4. **Salary validation** - Ensures min <= max
5. **Status validation** - Only allows valid status values
6. **Security headers** - X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
7. **Error handling** - Doesn't leak sensitive information
8. **Secret data protection** - Removes sensitive prompts from API responses

### Update Career Endpoint (`/api/update-career`)

Same protections as add-career endpoint.

## Best Practices

1. **Always sanitize user input** before storing in database
2. **Use `sanitizeHTML()`** only for fields that need rich text (descriptions, bios)
3. **Use `sanitizeText()`** for all other string fields
4. **Validate data structure** before processing
5. **Don't return sensitive data** in API responses
6. **Use security headers** on all API responses
7. **Log errors** but don't expose details to clients

## Dependencies

- `isomorphic-dompurify` - HTML sanitization (works in Node.js and browser)
- `validator` - String validation and sanitization
