import { Router } from 'express';
import { updateUserSchema, userIdSchema, listUsersQuerySchema } from '../validators/user.validator';
import { asyncHandler } from '@verveai/common-node';
import * as userService from '../services/user.service';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';

const router = Router();

// Middleware to check ADMIN role
function requireAdmin(req: { headers: Record<string, string | undefined> }, res: { status: (code: number) => { json: (data: unknown) => unknown } }, next: () => void) {
  const role = req.headers['x-user-role'];
  if (role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    });
    return;
  }
  next();
}

// GET /users - List users (basic, no auth required)
router.get('/', asyncHandler(async (req, res) => {
  const skip = Number(req.query['skip'] ?? 0);
  const take = Number(req.query['take'] ?? 20);
  const result = await userService.listUsers(skip, take);
  res.json({ success: true, data: result });
}));

// GET /users/admin/list - List users with filters (ADMIN only)
router.get('/admin/list', validateQuery(listUsersQuerySchema), asyncHandler(async (req, res) => {
  const { skip, take, role, is_active, search } = req.query as {
    skip?: number; take?: number; role?: string; is_active?: string; search?: string;
  };
  const result = await userService.listUsersAdmin({
    skip,
    take,
    role,
    is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
    search,
  });
  res.json({ success: true, data: result });
}));

// GET /users/admin/stats - User statistics (ADMIN only)
router.get('/admin/stats', asyncHandler(async (req, res) => {
  const stats = await userService.getUserStats();
  res.json({ success: true, data: stats });
}));

// GET /users/:id - Get user (ADMIN or self)
router.get('/:id', validateParams(userIdSchema), asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params['id']!);
  res.json({ success: true, data: user });
}));

// PUT /users/:id - Update user (ADMIN only)
router.put('/:id', validateParams(userIdSchema), validateBody(updateUserSchema), requireAdmin, asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params['id']!, req.body);
  res.json({ success: true, data: user });
}));

// PATCH /users/:id - Partial update user (ADMIN only)
router.patch('/:id', validateParams(userIdSchema), validateBody(updateUserSchema), requireAdmin, asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params['id']!, req.body);
  res.json({ success: true, data: user });
}));

// DELETE /users/:id - Delete user (ADMIN only)
router.delete('/:id', validateParams(userIdSchema), requireAdmin, asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params['id']!);
  res.status(204).send();
}));

export default router;
