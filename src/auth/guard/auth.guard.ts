import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants/jwt.constant';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService
  ){}
 async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request)
    if(!token){
      throw new UnauthorizedException()
    }
    try{
      const payload = await this.jwtService.verifyAsync(token,
        {
          secret: jwtConstants.secret
        }
      );
      request['user'] = payload;
    }catch{
    throw new UnauthorizedException();
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
  
    if (typeof authHeader === 'string') {
      const [type, token] = authHeader.split(' ');
  
      if (type === 'Bearer') {
        return token;
      }
    }  
    return undefined;
  }
  
}
