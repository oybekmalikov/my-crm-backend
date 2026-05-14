import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException({ message: 'TOKEN_NOT_GIVEN' });
    }
    const [bearer, token] = authHeader.split(' ');
    if (bearer != 'Bearer' && !token) {
      throw new UnauthorizedException('INVALID_TOKEN');
    }
    let user: any;
    try {
      user = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      req.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'TOKEN_EXPIRED',
        error,
      });
    }
  }
}
