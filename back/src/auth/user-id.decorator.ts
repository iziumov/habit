import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface UserPayload {
  id: string;
}

interface RequestWithUser extends Request {
  user?: UserPayload;
}

export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    return req.user?.id;
  },
);
