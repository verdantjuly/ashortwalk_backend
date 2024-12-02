import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService, UserService } from '../services';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../dto';
import { LoginDto } from '../dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('check')
  @UseGuards(AuthGuard())
  loginChecker(): boolean {
    return true;
  }

  @Get('login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req, @Res() res) {
    const result = await this.authService.kakaoLogin(req);
    return res.redirect(
      `https://ashortwalk-gkd3dvdpfcexb0ce.koreacentral-01.azurewebsites.net/posts?refreshtoken=${result.refreshToken}&accesstoken=${result.accessToken}`,
    );
  }

  @Post('kakaokey')
  async kakaoKey() {
    return await this.authService.kakaoKey();
  }

  @Post('email')
  async email(@Body() body) {
    return await this.userService.sendEmail(body.email);
  }

  @Post('verify')
  async verify(@Body() body) {
    return await this.userService.verifyEmail(body.email, body.number);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const { email, nickname, password } = createUserDto;
    return await this.userService.createUser(
      email,
      nickname,
      password,
      'email',
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Req() req) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    const accessToken = await this.authService.refresh(refreshToken);
    return { accessToken: accessToken };
  }
}
