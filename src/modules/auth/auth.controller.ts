import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { MESSAGES } from '../../constants';
import { asyncHandler } from '../../utils';

export class AuthController {

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      message: MESSAGES.LOGIN_SUCCESS,
      data: {
        accessToken: result.accessToken,
        user: result.user
      }
    });
  });

  static refresh = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    const userId = req.body.userId;

    const result = await AuthService.refresh(userId, token);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: MESSAGES.TOKEN_UPDATED,
      data: {
        accessToken: result.accessToken,
      },
    });
  };

  static logout = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    await AuthService.logout(userId!);
    res.clearCookie('refreshToken');
    return res.json({
      success: true,
      message: MESSAGES.LOGOUT_SUCCESS
    });
  };
}