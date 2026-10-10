import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route (or an entire controller) as not requiring authentication.
 * Use on endpoints such as login that must be reachable without a JWT.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
