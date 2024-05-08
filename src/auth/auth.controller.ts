import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';
import { AuthGuard } from './guard/auth.guard';
import { LoginDto } from './login.dto';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { Role } from '../common/enums/rol.enum';
import { Auth } from './decorators/auth.decorator';
import { ActiveUser } from 'src/common/enums/decoratprs/active-user.decorator';
import { UserActiveInterface } from 'src/common/enums/interfaces/user-active.interfaces';

interface RequestWithUser extends Request {
  user: {
    email: string;
    role: string;
  };
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(
    @Body()
    registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }
  @Post('login')
  login(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }
//   @Get('profile')
//   @Roles(Role.USER )
//   @UseGuards(AuthGuard, RolesGuard)
//   profile(@Request() req: RequestWithUser) {
//     return this.authService.profile({
//       email: req.user.email,
//       rol: req.user.role,
//     });
//   }
  @Get('profile')
  @Auth(Role.ADMIN)
  profile(@ActiveUser()  user: UserActiveInterface) {
    return this.authService.profile(user);
  }
}
