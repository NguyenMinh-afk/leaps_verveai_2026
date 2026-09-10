import { Router, Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema, refreshSchema } from '../validators/auth.validator';
import { logger } from '../utils/logger';

const router = Router();

// VP-221: Login endpoint
router.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

// VP-226: Register endpoint
router.post('/register', validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, role } = req.body;
    const user = await authService.register(email, password, name, role);

    res.status(201).json({
      success: true,
      data: user,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

// VP-222: Logout endpoint
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: 'NO_TOKEN', message: 'Authorization token required' },
      });
    }

    await authService.logout(token);

    res.json({
      success: true,
      data: { message: 'Logged out successfully' },
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

// VP-227: Refresh token endpoint
router.post('/refresh', validate(refreshSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokens(refreshToken);

    res.json({
      success: true,
      data: result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

// VP-223: Session check endpoint
router.get('/session', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: 'NO_TOKEN', message: 'Authorization token required' },
      });
    }

    // Gateway already verified JWT and set X-User-Id header
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: 'UNAUTHORIZED', message: 'Invalid session' },
      });
    }

    res.json({
      success: true,
      data: {
        authenticated: true,
        userId,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

// VP-224: Get current user endpoint
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Gateway already verified JWT and set X-User-Id header
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({
        success: false,
        data: null,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      });
    }

    const user = await authService.getCurrentUser(userId);

    res.json({
      success: true,
      data: user,
      error: null,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
