import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../app.constants';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Global role-based access control guard.
 *
 * - Routes/controllers marked with `@Public()` are skipped entirely.
 * - Routes/controllers with no `@Roles(...)` metadata are allowed for any
 *   authenticated user (authentication itself is enforced by `AuthGuard`,
 *   which always runs first).
 * - `SUPERADMIN` always passes.
 * - Otherwise the authenticated user's `role` must be included in the
 *   `@Roles(...)` list declared on the handler or controller.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!user || !user.role) {
      throw new ForbiddenException({ message: 'AUTH.UNAUTHORIZED' });
    }

    if (user.role === 'SUPERADMIN') {
      return true;
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException({ message: 'AUTH.ACCESS_DENIED' });
    }

    return true;
  }
}
