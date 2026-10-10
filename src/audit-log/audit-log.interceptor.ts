import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from './audit-log.service';

const MUTATING_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);

// Paths to skip (auth login/refresh are excluded by design)
const SKIP_PATH_PREFIXES = ['/auth/log-in', '/auth/refresh', '/auth/forgot-password', '/auth/reset-password'];

function inferEntityType(path: string): string {
  // Remove query string
  const cleanPath = path.split('?')[0];
  // Take the first path segment after the leading slash
  const segment = cleanPath.split('/').filter(Boolean)[0] ?? '';
  // Convert kebab-case to PascalCase entity name
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<any>();
    const method: string = req.method ?? '';
    const path: string = req.path ?? req.url ?? '';

    // Only intercept mutating requests
    if (!MUTATING_METHODS.has(method)) {
      return next.handle();
    }

    // Skip auth endpoints
    const shouldSkip = SKIP_PATH_PREFIXES.some((prefix) =>
      path.startsWith(prefix),
    );
    if (shouldSkip) {
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse<any>();
          const user = req.user as { userId?: string; login?: string } | undefined;

          // Fire-and-forget – never block or throw
          this.auditLogService
            .create({
              userId: user?.userId,
              userLogin: user?.login,
              action: method,
              path,
              entityType: inferEntityType(path),
              statusCode: res.statusCode,
              ip:
                req.ip ??
                req.headers?.['x-forwarded-for'] ??
                req.socket?.remoteAddress,
              timestamp: new Date(),
            })
            .catch(() => {
              // Silently swallow – logging failures must never affect the response
            });
        },
      }),
    );
  }
}
