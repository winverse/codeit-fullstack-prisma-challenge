import { FIFTEEN_MINUTES_IN_MS, SEVEN_DAYS_IN_MS } from '../common/constants/time.js';
import { config } from '../config/config.js';

export const setAuthCookies = (res, tokens) => {
  const { accessToken, refreshToken } = tokens;

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    maxAge: FIFTEEN_MINUTES_IN_MS,
    path: '/',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    maxAge: SEVEN_DAYS_IN_MS,
    path: '/',
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
};