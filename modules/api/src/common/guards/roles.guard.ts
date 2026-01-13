import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enums';
import { ClerkRequest } from './clerk-auth.guard';

type RoleClaim = string | string[] | undefined;

const normalizeRoles = (claim: RoleClaim): string[] => {
  if (Array.isArray(claim)) {
    return claim;
  }
  return claim ? [claim] : [];
};

const extractRoles = (sessionClaims: Record<string, unknown> | undefined) => {
  if (!sessionClaims) {
    return [];
  }

  const claims = sessionClaims as Record<string, any>;
  const candidateRoles = [
    claims.roles,
    claims.role,
    claims.publicMetadata?.roles,
    claims.publicMetadata?.role,
    claims.public_metadata?.roles,
    claims.public_metadata?.role,
  ];

  return candidateRoles.flatMap((roleClaim) => normalizeRoles(roleClaim));
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<ClerkRequest>();
    const roles = extractRoles(request.auth?.sessionClaims);
    const hasRole = requiredRoles.some((role) => roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Insufficient role permissions');
    }

    return true;
  }
}
