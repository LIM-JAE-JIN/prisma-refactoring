import { Router } from 'express';
import { prisma } from '../utils/prisma/index.js';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';
import { UsersRepository } from '../repositories/users.repository.js';

const usersRepository = new UsersRepository(prisma);
const authService = new AuthService(usersRepository);
const authController = new AuthController(authService);

const authRouter = Router();

// 회원가입
authRouter.post('/signup', authController.createUser);

// 로그인
authRouter.post('/signin', authController.userLogin);

export { authRouter };
