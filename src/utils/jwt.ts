import jwt from 'jsonwebtoken';
import { JwtUserPayload } from '../modules/auth/auth.types';
import { app } from '../config';


export const generateAccessToken = (payload: JwtUserPayload) =>
  jwt.sign(payload, app.jwtAccessSecret!, { expiresIn: '15m' });

export const generateRefreshToken = (payload: JwtUserPayload) =>
  jwt.sign(payload, app.jwtRefreshSecret!, { expiresIn: '7d' });

export const verifyAccessToken = (token: string): JwtUserPayload =>
  jwt.verify(token, app.jwtAccessSecret!) as JwtUserPayload;

export const verifyRefreshToken = (token: string): JwtUserPayload =>
  jwt.verify(token, app.jwtRefreshSecret!) as JwtUserPayload;