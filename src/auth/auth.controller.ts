import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ExistingUserDTO } from 'src/user/dto/existing-user.dto';

import { NewUserDTO } from 'src/user/dto/new-user.dto';
import { UserInterface } from 'src/user/interfaces/user.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: NewUserDTO): Promise<UserInterface | null> {
    return this.authService.registerUser(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  login(@Body() user: ExistingUserDTO): Promise<{ token: string } | null> {
    return this.authService.loginUser(user);
  }
}
