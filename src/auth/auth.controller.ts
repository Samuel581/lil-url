import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Auth } from './entities/auth.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Log in and receive a JWT' })
  @ApiResponse({ status: 200, type: Auth })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() body: LoginDto): Promise<Auth> {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: Auth })
  async register(@Body() body: CreateUserDto): Promise<Auth> {
    return this.authService.register(body.email, body.password);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Log out (client-side token removal)' })
  @ApiResponse({ status: 201, description: 'Logged out successfully' })
  async logout(): Promise<{ message: string }> {
    return { message: 'Logged out successfully' };
  }
}
