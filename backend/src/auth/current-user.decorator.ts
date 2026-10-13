import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../users/user.entity';

/** Shape of request.user, as returned by JwtStrategy.validate(). */
export interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
  name: string;
}

/** The user from the verified JWT. Never take user IDs or roles from the request body. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => ctx.switchToHttp().getRequest().user,
);
