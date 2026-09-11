export interface JwtPayload {
  sub: string;   // user ID
  role: string;  // UserRole
  email?: string;
  name?: string;
  iat?: number;
  exp?: number;
  iss?: string;
}
