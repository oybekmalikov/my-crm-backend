import { NextFunction, Request, Response } from 'express';

/**
 * Strips keys starting with `$` or containing `.` from req.body/query/params,
 * recursively. This blocks NoSQL-injection payloads such as
 * `{ "login": { "$ne": null } }` or `{ "login.$gt": "" }` from reaching
 * Mongoose queries built directly from client input (e.g. `findOne({ login })`).
 */
function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    const clean: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(
      value as Record<string, unknown>,
    )) {
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      clean[key] = sanitizeValue(val);
    }
    return clean;
  }
  return value;
}

/** Plain Express middleware, wired up with `app.use(sanitizeRequestData)` in main.ts. */
export function sanitizeRequestData(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    const sanitizedQuery = sanitizeValue(req.query) as Record<
      string,
      unknown
    >;
    for (const key of Object.keys(req.query)) {
      delete (req.query as Record<string, unknown>)[key];
    }
    Object.assign(req.query, sanitizedQuery);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params) as Record<string, string>;
  }
  next();
}
