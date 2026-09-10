import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
import { AuthError } from '@verveai/error-types';
import { config } from '../config/env';
import { logger } from '../utils/logger';

const BCRYPT_ROUNDS = 12;

export interface LoginResult {
  token: string;
  refreshToken: string;
  expiresAt: Date;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.is_active) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AuthError('INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  const token = jwt.sign(
    { sub: user.id, role: user.role, email: user.email, name: user.name },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN, issuer: config.JWT_ISSUER },
  );

  const refreshToken = jwt.sign(
    { sub: user.id, type: 'refresh' },
    config.JWT_SECRET,
    { expiresIn: '7d', issuer: config.JWT_ISSUER },
  );

  await prisma.session.create({
    data: {
      user_id: user.id,
      token,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    },
  });

  logger.info('User logged in', { userId: user.id, email: user.email });

  return {
    token,
    refreshToken,
    expiresAt,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

export async function register(email: string, password: string, name: string, role: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AuthError('EMAIL_EXISTS', 'Email already registered');
  }

  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, password: hashed, name, role: role as 'TEACHER' | 'ADMIN' | 'SUPERVISOR' },
    select: { id: true, email: true, name: true, role: true },
  });

  logger.info('User registered', { userId: user.id, email: user.email });
  return user;
}

export async function logout(token: string): Promise<void> {
  await prisma.session.updateMany({
    where: { token },
    data: { revoked_at: new Date() },
  });
}

export async function refreshTokens(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, config.JWT_SECRET) as { sub: string; type: string };
    if (payload.type !== 'refresh') throw new Error('Not a refresh token');

    const session = await prisma.session.findFirst({
      where: { refresh_token: refreshToken, revoked_at: null },
      include: { user: true },
    });

    if (!session || !session.user.is_active) {
      throw new AuthError('INVALID_TOKEN', 'Invalid or expired refresh token');
    }

    const newToken = jwt.sign(
      { sub: session.user.id, role: session.user.role, email: session.user.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN, issuer: config.JWT_ISSUER },
    );

    await prisma.session.update({
      where: { id: session.id },
      data: { token: newToken },
    });

    return { token: newToken };
  } catch (err) {
    throw new AuthError('INVALID_TOKEN', 'Invalid or expired refresh token');
  }
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      is_active: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!user || !user.is_active) {
    throw new AuthError('USER_NOT_FOUND', 'User not found or inactive');
  }

  return user;
}
