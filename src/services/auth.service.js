import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export class AuthService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  createUser = async (email, password, passwordConfirm, name, res) => {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '이메일 입력이 필요합니다.'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: '비밀번호 입력이 필요합니다.'
      });
    }

    if (!passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: '비밀번호 확인 입력이 필요합니다.'
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: '이름 입력이 필요합니다.'
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: '입력 한 비밀번호가 서로 일치하지 않습니다.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 최소 6자리 이상입니다.'
      });
    }

    let emailValidationRegex = new RegExp('[a-z0-9._]+@[a-z]+.[a-z]{2,3}');
    const isValidEmail = emailValidationRegex.test(email);
    if (!isValidEmail) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 형식이 아닙니다.'
      });
    }

    const existedUser = await this.usersRepository.findEmail(email);

    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: '이미 가입 된 이메일입니다.'
      });
    }

    const findName = await this.usersRepository.findName(name);

    if (findName) {
      return res.status(400).json({
        success: false,
        message: '중복된 이름입니다.'
      });
    }

    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS));

    const newUser = await this.usersRepository.createUser(email, hashedPassword, name);

    return {
      userId: newUser.userId,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };
  };

  userLogin = async (email, password, res) => {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '이메일 입력이 필요합니다.'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: '비밀번호 입력이 필요합니다.'
      });
    }
    const user = await this.usersRepository.findEmail(email);
    const hashedPassword = user.password ?? '';
    const isPasswordMatched = bcrypt.compareSync(password, hashedPassword);

    const isCorrectUser = user && isPasswordMatched;

    if (!isCorrectUser) {
      return res.status(401).json({
        success: false,
        message: '일치하는 인증 정보가 없습니다.'
      });
    }

    const accessToken = jwt.sign({ userId: user.userId }, process.env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });

    return {
      accessToken
    }
  };

}