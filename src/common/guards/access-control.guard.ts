import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(
    private readonly accessMatrix: Record<string, string[]>,
    private readonly tbl: string,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user || !user.role) {
      throw new ForbiddenException("User not authenticated.");
    }
    if (user.role === "superadmin") {
      return true;
    }
    const allowedRoles = this.accessMatrix[this.tbl] || [];
    const hasAccess = allowedRoles.some((role) => user.role.includes(role));
    if (!hasAccess) {
      throw new ForbiddenException("Access denied to this data");
    }
    return true;
  }
}
