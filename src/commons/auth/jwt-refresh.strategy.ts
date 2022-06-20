import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      //검중부, Bearer 뺴고 넣어야함, 내장 되어있음 .fromauthheadera
      jwtFromRequest: (req) => {
        console.log(req.headers);
        const bakeCookie = req.headers.cookie.split(' ');
        const result = bakeCookie[bakeCookie.length - 1].replace(
          'refreshToken=',
          '',
        ); //
        console.log(result);
        return result;
      },
      secretOrKey: 'myRefreshKey', //이부분이 다다름
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    // 실패 또는 성공여부를 알려줌
    //검증완료되면 실행
    const bakeCookie = req.headers.cookie.split(' ');
    const result = bakeCookie[bakeCookie.length - 1].replace(
      'refreshToken=',
      '',
    ); //
    const check = await this.cacheManager.get(`refreshToken: ${result}`);
    //검증완료되면 실행
    if (check) throw new UnauthorizedException();

    return {
      id: payload.sub, //리턴이 된거임 context 라는 곳으로
      userid: payload.userid,
    };
  }
}
