import { Router } from 'express';
import { updateUserSchema, userIdSchema } from '../validators/user.validator';
import { asyncHandler } from '@verveai/common-node';
import * as userService from '../services/user.service';
import { validateBody, validateParams } from '../middleware/validate';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const skip = Number(req.query['skip'] ?? 0);
  const take = Number(req.query['take'] ?? 20);
  const result = await userService.listUsers(skip, take);
  res.json({ success: true, data: result });
}));

router.get('/:id', validateParams(userIdSchema), asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params['id']!);
  res.json({ success: true, data: user });
}));

router.put('/:id', validateParams(userIdSchema), validateBody(updateUserSchema), asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params['id']!, req.body);
  res.json({ success: true, data: user });
}));

router.delete('/:id', validateParams(userIdSchema), asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params['id']!);
  res.status(204).send();
}));

export default router;
