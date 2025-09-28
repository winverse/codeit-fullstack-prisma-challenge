import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    config.JWT_SECRET,
    {
      expiresIn: '15m', // 상수로 변경 가능: '15m' -> 900s
    },
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, config.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

export const generateTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  return { accessToken, refreshToken };
};

export const verifyToken = (token, tokenType = 'access') => {
  try {
    const secret =
      tokenType === 'access'
        ? config.JWT_SECRET
        : config.JWT_REFRESH_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};