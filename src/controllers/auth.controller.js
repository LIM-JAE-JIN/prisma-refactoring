export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  // 회원가입
  createUser = async (req, res, next) => {
    try {
      const { email, password, passwordConfirm, name } = req.body;

      const newUser = await this.authService.createUser(email, password, passwordConfirm, name, res);

      return res.status(201).json({
        success: true,
        message: '회원가입에 성공했습니다.',
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  };

  // 로그인
  userLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const userLogin = await this.authService.userLogin(email, password, res);

      return res.status(200).json({
        success: true,
        message: '로그인에 성공했습니다.',
        data: userLogin
      });
    } catch (error) {
      next(error);
    }
  };
}