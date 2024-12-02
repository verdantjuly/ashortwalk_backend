import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenRepository, UserRepository } from '../repositories';
import { RefreshTokenRepository } from '../repositories';
import { UserService } from './user.service';
import { LoginDto } from '../dto/login.dto';
import { TokenPayload } from '../types/user.type';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly accessTokenRepository: AccessTokenRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  randomNickname() {
    return (
      '산책인#' +
      (Math.floor(Math.random() * (99999999999 - 11111111111 + 1)) +
        11111111111)
    );
  }

  async kakaoLogin(@Req() req) {
    const password = req.user.password;
    const existingUser = await this.userService.findByKakaoPassword(password);
    const role = req.user.role;
    let nickname = this.randomNickname();
    const isNickname = await this.userRepository.findUserByNickname(nickname);
    while (isNickname) nickname = this.randomNickname();
    if (existingUser) {
      const accessToken = await this.createAccessToken({
        id: existingUser.id,
        role: existingUser.role,
        nickname: existingUser.nickname,
      });
      const refreshToken = await this.createRefreshToken({
        id: existingUser.id,
        role: existingUser.role,
        nickname: existingUser.nickname,
      });
      return { accessToken, refreshToken };
    }
    const user = await this.userService.createUser(
      null,
      nickname,
      password,
      role,
    );
    return user;
  }

  async createAccessToken(payload: TokenPayload): Promise<string> {
    const expiresIn = process.env.ACCESS_EXPIRES_IN;
    const token = 'Bearer ' + this.jwtService.sign({ payload }, { expiresIn });

    await this.accessTokenRepository.saveAccessToken(
      payload.id,
      token,
      Number(expiresIn),
    );
    return token;
  }

  async createRefreshToken(payload: TokenPayload): Promise<string> {
    const expiresIn = process.env.ACCESS_EXPIRES_IN;
    const token = 'Bearer ' + this.jwtService.sign({ payload }, { expiresIn });

    await this.refreshTokenRepository.saveRefreshToken(
      payload.id,
      token,
      Number(expiresIn),
    );
    return token;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException();
    }
    const result = await this.userService.comparePasswords(
      user.password,
      loginDto.password,
    );
    if (!result) {
      throw new BadRequestException();
    }
    const accessToken = await this.createAccessToken({
      id: user.id,
      role: user.role,
      nickname: user.nickname,
    });
    const refreshToken = await this.createRefreshToken({
      id: user.id,
      role: user.role,
      nickname: user.nickname,
    });
    return { accessToken, refreshToken };
  }

  async kakaoKey() {
    return {
      kakaoJSKey: process.env.KAKAO_CLIENT_ID,
      kakaoRedirectURI: process.env.KAKAO_CALLBACK_URL,
    };
  }
  async googleKey() {
    return {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleRedirectURI: process.env.GOOGLE_CALLBACK_URL,
    };
  }
  async refresh(refreshToken: string) {
    const user = this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_JWT_SECRET,
    });

    if (!user) {
      throw new ForbiddenException('Invalid token');
    }
    const accessToken = this.createAccessToken({
      id: user.id,
      role: user.role,
      nickname: user.nickname,
    });

    return accessToken;
  }
}
