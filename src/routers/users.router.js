import { Router } from 'express';
import { needSignin } from '../middlewares/need-signin.middleware.js';
import { UsersController } from '../controllers/users.controller.js';
const usersRouter = Router();

const usersController = new UsersController();

// 내정보 조회 API
usersRouter.get('/me', needSignin, usersController.getMyInfo);

export { usersRouter };
