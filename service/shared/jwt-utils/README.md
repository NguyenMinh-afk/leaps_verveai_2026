# @verveai/jwt-utils

JWT verification utilities for the VERVEAI API Gateway.

## Purpose

Provides JWT (JSON Web Token) verification for the API Gateway. The Gateway is the **single point of JWT verification** — downstream services trust the Gateway's verification and use `X-User-Id` and `X-User-Role` headers instead of re-verifying tokens.

## Installation

```bash
pnpm add @verveai/jwt-utils
```

## Configuration

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | (required) | Secret key used to sign and verify tokens |
| `JWT_ISSUER` | `verveai` | Expected token issuer |

## Usage

### Verify Token

```typescript
import { verify } from '@verveai/jwt-utils';

try {
  const payload = verify(token);
  console.log({
    userId: payload.sub,
    role: payload.role,
    email: payload.email,
  });
  // Forward request to service with X-User-Id and X-User-Role headers
} catch (error) {
  // Token is invalid, expired, or has wrong issuer
  return res.status(401).json({ error: 'Invalid token' });
}
```

### Verify with Custom Options

```typescript
import { verify } from '@verveai/jwt-utils';

const payload = verify(token, {
  secret: 'custom-secret-min-32-chars!!',
  issuer: 'custom-issuer',
});
```

### Decode Without Verifying

```typescript
import { decode } from '@verveai/jwt-utils';

// Returns payload without verifying signature
const payload = decode(token);

if (payload) {
  console.log(`User: ${payload.sub}`);
}
```

### Check If Expired

```typescript
import { isExpired } from '@verveai/jwt-utils';

if (isExpired(token)) {
  // Token has expired
  return res.status(401).json({ error: 'Token expired' });
}
```

## Gateway Policy Example

```typescript
// gateway/src/policies/jwt.ts
import { verify } from '@verveai/jwt-utils';

export const jwtPolicy = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.substring(7);

  try {
    const payload = verify(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

## Payload Structure

```typescript
interface JwtPayload {
  sub: string;       // User ID (required)
  role: string;      // UserRole: TEACHER, ADMIN, SUPERVISOR (required)
  email?: string;    // User email
  name?: string;     // User name
  iat?: number;      // Issued at (Unix timestamp)
  exp?: number;      // Expiration (Unix timestamp)
  iss?: string;      // Issuer
}
```

## Token Generation (svc-auth)

The `service-auth` service generates tokens using the same `jsonwebtoken` library:

```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  {
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  },
  process.env.JWT_SECRET,
  {
    issuer: process.env.JWT_ISSUER || 'verveai',
    expiresIn: '7d',
  },
);
```

## Security Notes

1. **Always use HTTPS** in production to prevent token interception.
2. **JWT_SECRET must be at least 32 characters** and stored securely (e.g., Kubernetes Secrets).
3. **Never commit JWT_SECRET** to version control.
4. **Token expiration**: Use short-lived tokens (e.g., 1 hour) with refresh tokens for extended sessions.
5. **Services trust Gateway**: Services should NOT re-verify JWT — they only use headers set by the Gateway.

## Testing

```bash
pnpm test        # Run tests
pnpm test:cov    # Run tests with coverage
```

Coverage thresholds:
- Lines: 90%
- Functions: 90%
- Branches: 85%
- Statements: 90%

## License

MIT
