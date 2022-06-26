import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      //누구든지 열어볼 수 있다
      { userid: user.userid, sub: user.id },
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );
    console.log('여기여기', refreshToken);
    //개발 환경
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);

    // 배포환경 이부분 뒤에 저장 , 'https://myfrontsite.com'

    // 배포환경;
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // res.cookie('Authentication', refreshToken, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60 * 2,
    // });
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=localhost; SameSite=None; Secure=false; httpOnly;`,
    );

    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      //누구든지 열어볼 수 있다
      { userid: user.userid, sub: user.id },
      { secret: 'myAccessKey', expiresIn: '1h' },
    );
  }
}
