import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { AuthService } from './auth.service';

class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('login') login(@Body() dto: LoginDto) { return this.auth.login(dto.email, dto.password); }
}
