import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../../../api/user/entities/user.entity';
import { jwtConstants } from '../constants/constants';
import { JwtPayload } from '../interfaces/jwt-payload.inteface';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.at_secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findOneBy({ uuid: payload.id });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
