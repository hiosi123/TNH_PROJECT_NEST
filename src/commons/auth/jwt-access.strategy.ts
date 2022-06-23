import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { isCompositeType } from 'graphql';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      //검중부, Bearer 뺴고 넣어야함, 내장 되어있음 .fromauthheadera
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myAccessKey',
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    // 실패 또는 성공여부를 알려줌
    // 블랙리스트에 토큰이 들어가 있는지? throw error/ 토큰 말료까지 남은 시간을 저장
    //검증완료되면 실행
    const accessToken = req.headers.authorization.split(' ')[1];
    const check = await this.cacheManager.get(`accessToken: ${accessToken}`);

    if (check) throw new UnauthorizedException();
    console.log(payload);
    return {
      id: payload.sub, //리턴이 된거임 context 라는 곳으로
      userid: payload.userid,
    };
  }
}
