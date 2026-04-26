import { Request, Response, RequestHandler  } from 'express';
import { UserService } from './user.service';
import { ApiResponseUtil, asyncHandler } from '../../utils';
import { VerifyUserParams } from './user.types';


const verifyUserController: RequestHandler = async (req, res) => {
  const { userId, token } = req.params as VerifyUserParams;

  const result = await UserService.verifyUser({
    userId: Number(userId),
    token
  });

  return res.status(200).json(
    ApiResponseUtil.success(result.message, result.data)
  );
};

export class UserController {

  static createUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await UserService.createUser(req.body);

    return res.status(200).json(
      ApiResponseUtil.success(result.message, result.data)
    );
  });

  static verifyUser = asyncHandler(verifyUserController);

}