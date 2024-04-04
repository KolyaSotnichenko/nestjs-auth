import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type TypeData = keyof Prisma.UserSelect;

export const User = createParamDecorator(
  (data: TypeData, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    return data ? user[data] : user;
  },
);
