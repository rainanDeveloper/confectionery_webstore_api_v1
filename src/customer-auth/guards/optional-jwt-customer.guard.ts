import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtCustomerGuard extends AuthGuard('jwt-customer') {
  handleRequest<TUser = any>(
    _err: any,
    user: any,
    _info: any,
    _context: ExecutionContext,
  ): TUser {
    return user;
  }
}
